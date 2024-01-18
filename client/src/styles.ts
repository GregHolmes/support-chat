// styles.ts
export const commonStyles = {
};

export const chatStyles = {
  chatContainer: {
    display: 'flex',
    flexDirection: 'column' as 'column',
    width: '75vw',
    height: '66vh',
    maxWidth: '700px',
    margin: 'auto',
    marginTop: '20px',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '5px',
  },
  messageListContainer: {
    flex: 1,
    marginBottom: '20px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    overflowY: 'auto' as 'auto',
    padding: '10px',
  },
  messageInputContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
  },
};

export const messageStyles = {
  message: {
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '5px',
    maxWidth: '70%',
    display: 'flex', // Added display:flex for better text alignment
  },
  messageText: {
    flex: 1, // Added flex: 1 to make the text take up available space
  },
  messageFromUser: {
    alignSelf: 'flex-end',
    backgroundColor: '#0084ff',
    color: 'white',
    marginLeft: 'auto',
  },
  messageFromOthers: {
    alignSelf: 'flex-start',
    backgroundColor: '#e6e6e6',
  },
};

export const messageListStyles = {
  // Styles for MessageList
  // ...
};

export const messageInputStyles = {
  messageForm: {
    width: '100%',
    textAlign: 'left' as 'left',
  },
  input: {
    flex: 1,
    padding: '10px',
    marginRight: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    width: '85%',
  },
  button: {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    cursor: 'pointer',
    width: '10%',
  },
};