import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Formik, Field, Form, type FormikHelpers, ErrorMessage } from "formik";
import * as Yup from "yup";
import { createNote, type NewNoteData } from "../../services/noteService";
import css from "./NoteForm.module.css";

interface NoteFormProps {
    onSuccess: () => void;
    onCancel: () => void;
}

const noteSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "title must be no less than 3 characters")
    .max(50, "title must be no more than 50 characters")
    .required("title is required"),
  content: Yup.string().max(500),
    tag: Yup.string()
  .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"], "invalide tag value")
  .required("tag is required"),
});

export const NoteForm = ({ onSuccess, onCancel }: NoteFormProps) => {
    const queryClient = useQueryClient();

  const createNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["notes"] });
      onSuccess();
        },
  });

  const handleSubmit = (
    values: NewNoteData,
    { resetForm }: FormikHelpers<NewNoteData>
  ) => {
    createNoteMutation.mutate(values, {
      onSuccess: () => {
        resetForm();
      },
    });
  };

return (
  <Formik
    initialValues={{ title: "", content: "", tag: "Todo" }}
    validationSchema={noteSchema}
    onSubmit={handleSubmit}
  >
    {({ isSubmitting }) => (
      <Form className={css.form}>
        <h2>Create New Note</h2>
        <div className={css.formGroup}>
          <label htmlFor="title">Title</label>
          <Field id="title" type="text" name="title" className={css.input} />
          <ErrorMessage name="title" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="content">Content</label>
          <Field
            id="content"
            as="textarea"
            name="content"
            rows={8}
            className={css.textarea}
          />
          <ErrorMessage name="title" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="tag">Tag</label>
          <Field id="tag" as="select" name="tag" className={css.select}>
            <option value="">Select a tag</option>
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </Field>
          <ErrorMessage name="title" component="span" className={css.error} />
        </div>

        <div className={css.actions}>
          <button type="button" className={css.cancelButton} onClick={onCancel}>
            Cancel
          </button>
          <button
            type="submit"
            className={css.submitButton}
            disabled={isSubmitting || createNoteMutation.isPending}
          >
            {isSubmitting || createNoteMutation.isPending
              ? "Creating..."
              : "Create note"}
          </button>
        </div>
      </Form>
    )}
  </Formik>
);
};