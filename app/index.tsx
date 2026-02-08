import React, { useEffect, useState } from "react";
import {
  FlatList,
  Text,
  View,
  Alert,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  LayoutAnimation,
  UIManager,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TodoItem from "../components/Todoitem";

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

const storageKey = "Tasklist";
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function Index() {
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showInput, setShowInput] = useState(false);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const storedTasks = await AsyncStorage.getItem(storageKey);
        if (storedTasks) setTasks(JSON.parse(storedTasks));
      } catch {
        Alert.alert("Error", "Failed to load tasks.");
      } finally {
        setLoading(false);
      }
    };
    loadTasks();
  }, []);

  useEffect(() => {
    if (!loading) saveTasks(tasks);
  }, [tasks, loading]);

  const saveTasks = async (tasks: Task[]) => {
    try {
      await AsyncStorage.setItem(storageKey, JSON.stringify(tasks));
    } catch {
      Alert.alert("Error", "Failed to save tasks.");
    }
  };

  const addTask = () => {
    if (newTaskTitle.trim() === "") {
      Alert.alert("Validation Error", "Task title cannot be empty.");
      return;
    }
    const newTask: Task = { id: Date.now(), title: newTaskTitle, completed: false };
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setTasks([...tasks, newTask]);
    setNewTaskTitle("");
    setShowInput(false);
  };

  const deleteTask = (id: number) => {
    Alert.alert("Confirm Delete", "Are you sure you want to delete this task?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          setTasks(tasks.filter(task => task.id !== id));
        },
      },
    ]);
  };

  const toggleTask = (id: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const updateTask = (id: number, newTitle: string) => {
    if (newTitle.trim() === "") {
      Alert.alert("Validation Error", "Task title cannot be empty.");
      return;
    }
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, title: newTitle } : task
    ));
  };

  const filteredTasks = tasks
    .filter(task => task.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => (a.completed === b.completed ? 0 : a.completed ? 1 : -1));

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Loading...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.container}>

        <View style={styles.header}>
          <Text style={styles.headerText}>To-Do List</Text>
        </View>


        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Search tasks..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
            placeholderTextColor="#b0b1b3"
          />
        </View>


        <FlatList
          data={filteredTasks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TodoItem
              task={item}
              onToggle={toggleTask}
              onDelete={deleteTask}
              onUpdate={updateTask}
            />
          )}
          ListEmptyComponent={<Text style={styles.emptyText}>No tasks found.</Text>}
          contentContainerStyle={{ paddingBottom: 120 }}
        />


        {showInput && (
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Enter a new task"
              value={newTaskTitle}
              onChangeText={setNewTaskTitle}
              style={styles.input}
              onSubmitEditing={addTask}
              placeholderTextColor="#9CA3AF"
            />
            <TouchableOpacity style={styles.addButton} onPress={addTask}>
              <Text style={styles.buttonText}>Add</Text>
            </TouchableOpacity>
          </View>
        )}


        <TouchableOpacity
          style={styles.fab}
          onPress={() => setShowInput(!showInput)}
        >
          <Text style={styles.fabIcon}>{showInput ? "×" : "+"}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    backgroundColor: "#3B82F6",
    paddingVertical: 20,
  },
  headerText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
  searchContainer: {
    margin: 15,
  },
  searchInput: {
    padding: 10,
    borderColor: "#3B82F6",
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  inputContainer: {
    position: "absolute",
    bottom: 90,
    left: 20,
    right: 20,
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 3,
  },
  input: {
    flex: 1,
    padding: 12,
    borderColor: "#3B82F6",
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  addButton: {
    backgroundColor: "#3B82F6",
    paddingHorizontal: 20,
    justifyContent: "center",
    borderRadius: 8,
    marginLeft: 10,
    elevation: 2,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#6B7280",
    marginTop: 20,
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#3B82F6",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  fabIcon: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
  },
});