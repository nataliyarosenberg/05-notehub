import axios from "axios";
import type { Note, NoteTag} from "../types/note";

const API_KEY = import.meta.env.VITE_NOTEHUB_TOKEN;
const BASE_URL = "https://notehub-public.goit.study/api";

export interface FetchNotesResponse {
 
  notes: Note[];
  totalPages: number;
}
export interface FetchNotesParams {
  search?: string;
  page?: number;
  perPage?: number;
}

export interface NewNoteData {
  title: string;
  content: string;
  tag: NoteTag;
}

export interface DeletedNoteResponse {
  deletedNote: Note;
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
  params: FetchNotesParams
): Promise<FetchNotesResponse> => {
  const url = `${BASE_URL}/notes`;

  if (params.search && typeof params.search === 'string') {
    params.search = params.search.trim();
  }

    const { data } = await axios.get<FetchNotesResponse>(url, { params: params });
    return data;
  };

export const createNote = async (noteData: NewNoteData): Promise<Note> => {
  const {data} = await axios.post<CreateNoteResponse>(
    `${BASE_URL}/notes`,
    noteData,
    getHeaders()
  );
  return data.newNote;
};

export const deleteNote = async (
  noteId: string
): Promise<Note> => {
  const {data} = await axios.delete<DeletedNoteResponse>(
    `${BASE_URL}/notes/${noteId}`,
    getHeaders()
  );
  return data.deletedNote;
};
