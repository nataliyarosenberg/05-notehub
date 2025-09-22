import axios from "axios";
import type { Note } from "../types/note";

const API_KEY = import.meta.env.VITE_NOTEHUB_TOKEN;
const BASE_URL = "https://notehub-public.goit.study/api";

export interface FetchNotesResponse {
  notes: any;
  results: Note[];
  total_pages: number;
  total_results: number;
}

export interface NewNoteData {
  title: string;
  content: string;
  tag: string;
}

export interface DeletedNoteResponse {
  message: string;
  noteId: number;
}

const getHeaders = () => ({
  headers: {
    Authorization: `Bearer ${API_KEY}`,
  },
});

//function HTTP-query for notes
export const fetchNotes = async (
  searchValue: string,
  page: number = 1,
  perPage: number = 12
): Promise<FetchNotesResponse> => {
  const config = {
    ...getHeaders(),
    params: {
      page: page,
      perPage: perPage,
      search: searchValue.trim() || undefined,
    },
  };

  const url = `${BASE_URL}/notes`;

  if (!searchValue.trim()) {
    config.params.search = searchValue;
  }

  const res = await axios.get<FetchNotesResponse>(
    url,
    config
  );
  console.log(res.data);
  
  return res.data;
  }

export const createNote = async (noteData: NewNoteData): Promise<Note> => {
  const res = await axios.post<Note>(
    `${BASE_URL}/notes`,
    noteData,
    getHeaders()
  );
  return res.data;
};

export const deleteNote = async (
  noteId: number
): Promise<DeletedNoteResponse> => {
  const res = await axios.delete<DeletedNoteResponse>(
    `${BASE_URL}/notes/${noteId}`,
    getHeaders()
  );
  return res.data;
};
