import axios, { HttpStatusCode } from "axios/index";
import { QuestionData } from "vex-qna-archiver";

const API_BASE = "https://qnapi-production-b8f0.up.railway.app";

type SearchQuestionParams = {
  search_query: string | undefined;
  author: string | undefined;
  before: string | undefined;
  after: string | undefined;
  season: string | undefined;
  page: number;
  limit: number;
}

type QuestionResponse = {
  data: QuestionData[];
  next: boolean;
}

export const searchQuestions = async (params: SearchQuestionParams) => {
  const validParams: string[] = [];
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) {
      validParams.push(`${key}=${value}`);
    }
  }
  const url = `${API_BASE}/search?${validParams.join("&")}`;
  console.log(url);
  const response = await axios.get<QuestionResponse>(url);
  if (response.status === HttpStatusCode.Ok) {
    return { ...response.data, data: response.data.data.slice(0, params.limit) };
  }
  return { data: [], next: false };
};

export const getQuestion = async (id: string) => {
  const url = `${API_BASE}/q/${id}`;
  const response = await axios.get<QuestionData>(url);
  if (response.status === HttpStatusCode.Ok) {
    return response.data;
  }
  return null;
};
