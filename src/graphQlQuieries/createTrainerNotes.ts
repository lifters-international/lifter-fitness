export const createTrainerNotes = `
query CreateNewNote($note: String!, $client: String!, $token: String!) {
    createNewNote(note: $note, client: $client, token: $token) {
      id
      note
    }
  }
`;
