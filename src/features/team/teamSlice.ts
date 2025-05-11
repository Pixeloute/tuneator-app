import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Artist {
  id: string;
  name: string;
}
interface TeamMember {
  id: string;
  name: string;
}
interface ActivityEntry {
  id: string;
  text: string;
}
interface Note {
  id: string;
  text: string;
  author: string;
  date: string;
}
interface Task {
  id: string;
  title: string;
  assigned: string;
  due: string;
  status: string;
}

interface TeamState {
  artists: Artist[];
  teamMembers: TeamMember[];
  activity: ActivityEntry[];
  notes: Note[];
  tasks: Task[];
}

const initialState: TeamState = {
  artists: [],
  teamMembers: [],
  activity: [],
  notes: [],
  tasks: [],
};

const teamSlice = createSlice({
  name: 'team',
  initialState,
  reducers: {
    setArtists(state, action: PayloadAction<Artist[]>) {
      state.artists = action.payload;
    },
    setTeamMembers(state, action: PayloadAction<TeamMember[]>) {
      state.teamMembers = action.payload;
    },
    setActivity(state, action: PayloadAction<ActivityEntry[]>) {
      state.activity = action.payload;
    },
    setNotes(state, action: PayloadAction<Note[]>) {
      state.notes = action.payload;
    },
    setTasks(state, action: PayloadAction<Task[]>) {
      state.tasks = action.payload;
    },
    addNote(state, action: PayloadAction<Note>) {
      state.notes.unshift(action.payload);
    },
    addTask(state, action: PayloadAction<Task>) {
      state.tasks.unshift(action.payload);
    },
  },
});

export const { setArtists, setTeamMembers, setActivity, setNotes, setTasks, addNote, addTask } = teamSlice.actions;
export default teamSlice.reducer; 