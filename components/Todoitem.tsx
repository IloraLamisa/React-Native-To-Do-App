import { MaterialIcons } from "@expo/vector-icons";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
  UIManager,
  Platform,
} from "react-native";
import { useState } from "react";

interface Task {
  id: number;
  title: string;
  completed: boolean;
}
interface TodoItemProps {
  task: Task;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onUpdate: (id: number, newTitle: string) => void;
}

// Enable LayoutAnimation on Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function TodoItem({ task, onToggle, onDelete, onUpdate }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);

  const handleSave = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (editedTitle.trim() !== "") {
      onUpdate(task.id, editedTitle);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTitle(task.title);
    setIsEditing(false);
  };

  return (
    <View style={styles.card}>
      {/* Checkbox on the left */}
      <TouchableOpacity onPress={() => onToggle(task.id)} style={styles.checkbox}>
        <MaterialIcons
          name={task.completed ? "check-box" : "check-box-outline-blank"}
          size={24}
          color={task.completed ? "#3B82F6" : "#9CA3AF"}
        />
      </TouchableOpacity>

      {/* Task text or edit input */}
      {isEditing ? (
        <TextInput
          style={styles.editInput}
          value={editedTitle}
          onChangeText={setEditedTitle}
          onBlur={handleSave}
          autoFocus
        />
      ) : (
        <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.textContainer}>
          <Text style={[styles.text, task.completed && styles.completed]}>
            {task.title}
          </Text>
        </TouchableOpacity>
      )}

      {/* Edit / Cancel button */}
      {isEditing ? (
        <TouchableOpacity onPress={handleCancel} style={styles.iconButton}>
          <MaterialIcons name="cancel" size={22} color="#EF4444" />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.iconButton}>
          <MaterialIcons name="edit" size={22} color="#3B82F6" />
        </TouchableOpacity>
      )}

      {/* Delete button */}
      <TouchableOpacity onPress={() => onDelete(task.id)} style={styles.iconButton}>
        <MaterialIcons name="delete" size={22} color="#EF4444" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  checkbox: {
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  text: {
    fontSize: 16,
    color: "#111827",
  },
  completed: {
    textDecorationLine: "line-through",
    color: "#9CA3AF", // muted gray when completed
  },
  editInput: {
    flex: 1,
    padding: 6,
    borderColor: "#3B82F6",
    borderWidth: 1,
    borderRadius: 6,
    fontSize: 16,
  },
  iconButton: {
    marginLeft: 10,
  },
});