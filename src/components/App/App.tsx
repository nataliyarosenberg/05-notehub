import { useState, useEffect } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import toast, { Toaster } from "react-hot-toast";
import { fetchNotes } from "../../services/noteService";
import { NoteList } from "../NoteList/NoteList";
import { NoteForm } from "../NoteForm/NoteForm";
import SearchBox from "../SearchBox/SearchBox";
import { Pagination } from "../Pagination/Pagination";
import Loader from "../Loader/Loader";
import { ErrorMessage } from "../ErrorMessage/ErrorMessage";
import Modal from "../Modal/Modal";
import css from "./App.module.css";

export default function App() {
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, isError, isSuccess, isFetching, error } = useQuery({
    queryKey: ["notes", searchValue, page],
    queryFn: () => fetchNotes(searchValue, page),
   
    placeholderData: keepPreviousData,
  });

  const notes = data?.results || [];
  const totalPages = data?.total_pages || 0;

  useEffect(() => {
    if (isSuccess && notes.length === 0 && searchValue) {
      toast.error("There are no notes with this search.");
    }
  }, [isSuccess, notes, searchValue]);

  const debouncedHandleSearch = useDebouncedCallback((newQuery: string) => {
    setSearchValue(newQuery);
    setPage(1);
  }, 300);

  const handleToggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handlePageChange = (event: { selected: number }) => {
    setPage(event.selected + 1);
  };

  return (
    <div className={css.app}>
      <div className={css.toolbar}>
        <SearchBox onSubmit={debouncedHandleSearch} />
        {totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}

        <button className={css.button} onClick={handleToggleModal}>
          Create note +
        </button>
      </div>

      {(isLoading || isFetching) && <Loader />}
      {isError && error && (
        <ErrorMessage message={error?.message || "An error occurred."} />
      )}
      {!isFetching && notes.length > 0 ? (
        <NoteList notes={notes} />
      ) : (
        !isFetching &&
        !isError &&
        notes.length === 0 && <p className={css.noNotes}>No notes found.</p>
      )}

      {isModalOpen && (
        <Modal onClose={handleToggleModal}>
          <NoteForm
            onSuccess={handleToggleModal}
            onCancel={handleToggleModal}
          />
        </Modal>
      )}
      <Toaster />
    </div>
  );
}
