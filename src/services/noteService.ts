import axios from "axios";
import type { Note, NoteTag} from "../types/note";

const API_KEY = import.meta.env.VITE_NOTEHUB_TOKEN;
const BASE_URL = "https://notehub-public.goit.study/api";

export interface FetchNotesResponse {
 
  notes: Note[];
  totalPages: number;
}

export interface NewNoteData {
  title: string;
  content: string;
  tag: NoteTag;
}

export interface DeletedNoteResponse {
  message: string;
  noteId: string;
}

export interface CreateNoteResponse {
  newNote: Note;
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
  const url = `${BASE_URL}/notes`;

  const params: {
    searchValue: string,
      page: number,
      perPage: number,
      
  } = {
    page,
    perPage,
    searchValue: ""
  };

  if (!searchValue.trim()) {
    params.searchValue = searchValue.trim();
  }
  const config = {
    ...getHeaders(),
    params,
  }

  const res = await axios.get<FetchNotesResponse>(url, config);
  console.log(res.data);
    return res.data;
  }

export const createNote = async (noteData: NewNoteData): Promise<Note> => {
  const res = await axios.post<CreateNoteResponse>(
    `${BASE_URL}/notes`,
    noteData,
    getHeaders()
  );
  return res.data.newNote;
};

export const deleteNote = async (
  noteId: string
): Promise<DeletedNoteResponse> => {
  const res = await axios.delete<DeletedNoteResponse>(
    `${BASE_URL}/notes/${noteId}`,
    getHeaders()
  );
  return res.data;
};
