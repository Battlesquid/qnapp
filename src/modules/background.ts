import BackgroundService from "react-native-background-actions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getQuestion } from "./qnapi";
import notifee from "@notifee/react-native";
import { QuestionData } from "vex-qna-archiver";


const sleep = (time) => new Promise((resolve) => setTimeout(() => resolve(0), time));

const taskOptions = {
  taskName: "qna_subscribe",
  taskTitle: "Q&A Listener",
  taskDesc: "Listening for answered Q&As",
  taskIcon: {
    name: "ic_launcher",
    type: "mipmap"
  }
};

export type SubscribedQuestion = {
  [id: string]: {
    fulfilled: boolean;
    data: Pick<QuestionData, "title" | "author">
  };
}

export const startBackgroundService = () => {
  BackgroundService.start(async () => {
    await notifee.requestPermission();
    while (BackgroundService.isRunning()) {
      try {
        const data = await AsyncStorage.getItem("@qnapp/subscribed");
        if (data !== null) {
          const stored: SubscribedQuestion = JSON.parse(data);
          const answered: string[] = [];
          for (const [id, data] of Object.entries(stored)) {
            if (data.fulfilled) {
              continue;
            }
            const q = await getQuestion(id);

            if (q !== null && q.answered) {
              stored[id].fulfilled = true;
              answered.push(id);
            }
          }
          if (answered.length > 0) {
            const channel = await notifee.createChannel({
              id: "default",
              name: "qnapp"
            });
            await notifee.displayNotification({
              title: "New Q&A Answers!",
              body: `Answers for ${answered.length} subscribed Q&As.`,
              android: {
                channelId: channel,
                smallIcon: "ic-launcher",
                pressAction: {
                  id: "default"
                }
              }
            });
            AsyncStorage.setItem("@qnapp/subscribed", JSON.stringify(stored));
          }
        }
      } catch (e) {

      }
      await sleep(1000 * 60);
    }
  }, taskOptions);
};
