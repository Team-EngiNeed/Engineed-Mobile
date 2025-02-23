import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  Animated,
  TextInput,
  ImageBackground,
  Alert,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import api from "../../api";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ExeReports = () => {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [fullName, setFullName] = useState("");
  const [gradeSection, setGradeSection] = useState("");
  const [damagedProperty, setDamagedProperty] = useState("");
  const [comment, setComment] = useState("");
  const slideAnim = useState(new Animated.Value(500))[0];

  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchUsername = async () => {
      let storedUsername = await AsyncStorage.getItem("username");

      if (!storedUsername) {
        console.log("Fetching username from API...");
        try {
          const profileResponse = await api.get("api/user/profile/");
          storedUsername = profileResponse.data.username; // Adjust this based on API response structure
          await AsyncStorage.setItem("username", storedUsername);
        } catch (error) {
          console.error("Error fetching username from API:", error);
        }
      }

      if (storedUsername) {
        console.log("Username found:", storedUsername);
        setUsername(storedUsername);
      }
    };

    fetchUsername();
  }, []);

  // Fetch reports when username is available
  useEffect(() => {
    if (username) {
      fetchReports();
    }
  }, [username]); // Runs whenever `username` updates

  const fetchReports = async () => {
    try {
      let role = "executive"; // Default role

      if (username.includes("Executive")) role = "executive";
      else if (username.includes("Nurse")) role = "nurse";
      else if (username.includes("Labtech")) role = "labtech";
      else if (username.includes("Librarian")) role = "librarian";
      else if (username.includes("Utility")) role = "utility";

      console.log("Fetching reports for role:", role);
      const response = await api.get(`/api/notes/${role}/`);
      setReports(response.data);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchReports();
    setRefreshing(false);
  };

  const openModal = (report) => {
    setSelectedReport(report);
    setModalVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleDelete = async () => {
    if (!selectedReport) return;

    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this report?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              const response = await api.delete(
                `/api/notes/delete/${selectedReport.id}/`
              );

              if (response.status === 204) {
                alert("Report deleted successfully!");
                setModalVisible(false); // Close modal after deletion
                setReports((prevReports) =>
                  prevReports.filter((r) => r.id !== selectedReport.id)
                ); // Remove from list
              } else {
                alert("Failed to delete report.");
              }
            } catch (error) {
              console.error("Error deleting report:", error);
              alert("An error occurred while deleting the report.");
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: 500,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  const createReport = async () => {
    if (!fullName || !gradeSection || !damagedProperty || !comment) {
      alert("All fields are required.");
      return;
    }
    try {
      const newReport = { fullName, gradeSection, damagedProperty, comment };
      await api.post("/api/notes/", newReport);
      fetchReports();
      setCreateModalVisible(false);
      setFullName("");
      setGradeSection("");
      setDamagedProperty("");
      setComment("");
    } catch (error) {
      console.error("Error creating report:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Submissions</Text>
      <FlatList
        data={reports}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <View style={styles.reportCard}>
            <Text style={styles.reportTitle}>
              {item.damagedProperty.charAt(0).toUpperCase() +
                item.damagedProperty.slice(1)}
            </Text>
            <Text style={styles.reportComment}>Report: {item.comment}</Text>
            <Text style={styles.reportDetails}>
              Details: {item.fullName} from {item.gradeSection}
            </Text>

            <TouchableOpacity
              style={styles.moreInfoButton}
              onPress={() => openModal(item)}
            >
              <Text style={styles.moreInfoButtonText}>
                Click here for more Information!
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* MODAL - Note Details */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="none"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[
              styles.modalContent,
              { transform: [{ translateY: slideAnim }] },
            ]}
          >
            {selectedReport && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalHeaderText}>Note Details</Text>
                  <TouchableOpacity onPress={closeModal}>
                    <Ionicons name="close" size={24} color="black" />
                  </TouchableOpacity>
                </View>

                <Text style={styles.modalText}>
                  <Text style={styles.boldText}>Full Name:</Text>{" "}
                  {selectedReport.fullName}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.boldText}>Grade & Section:</Text>{" "}
                  {selectedReport.gradeSection}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.boldText}>Submitted on:</Text>{" "}
                  {new Date(selectedReport.dateSubmitted).toLocaleDateString()}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.boldText}>Damaged Property:</Text>{" "}
                  {selectedReport.damagedProperty || "Not specified"}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.boldText}>Comment:</Text>{" "}
                  {selectedReport.comment}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.boldText}>Status:</Text>{" "}
                  {selectedReport.completed ? (
                    <Text style={styles.completedText}>Completed!</Text>
                  ) : (
                    <Text style={styles.incompleteText}>Not yet completed</Text>
                  )}
                </Text>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={handleDelete}
                >
                  <Text style={styles.closeButtonText}>Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={closeModal}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </Animated.View>
        </View>
      </Modal>

      {/* MODAL - Create Report */}
      <Modal visible={createModalVisible} animationType="slide">
        <ImageBackground
          source={require("../../assets/images/ATRIUM.jpg")}
          style={styles.container}
          resizeMode="cover"
        >
          <View style={styles.modalWrapper}>
            <View style={styles.createModalContainer}>
              <Text style={styles.createModalHeader}>Create Report</Text>

              <TextInput
                placeholder="Full Name"
                value={fullName}
                onChangeText={setFullName}
                style={styles.input}
                placeholderTextColor="#ccc"
              />

              <TextInput
                placeholder="Grade & Section"
                value={gradeSection}
                onChangeText={setGradeSection}
                style={styles.input}
                placeholderTextColor="#ccc"
              />

              <Picker
                selectedValue={damagedProperty}
                onValueChange={(itemValue) => setDamagedProperty(itemValue)}
                style={styles.picker}
                dropdownIconColor="#fff"
              >
                <Picker.Item
                  label="Select a damaged property"
                  value=""
                  enabled={false}
                />
                <Picker.Item label="Chair" value="chair" />
                <Picker.Item label="Table" value="table" />
                <Picker.Item label="Electric Fan" value="electricfan" />
                <Picker.Item label="Outlet" value="outlet" />
                <Picker.Item label="Television" value="television" />
                <Picker.Item label="Whiteboard" value="whiteboard" />
                <Picker.Item label="Tiles" value="tiles" />
                <Picker.Item label="Window" value="window" />
                <Picker.Item label="Other" value="other" />
              </Picker>

              <TextInput
                placeholder="Comment"
                value={comment}
                onChangeText={setComment}
                style={[styles.input, styles.multilineInput]}
                placeholderTextColor="#ccc"
                multiline
              />

              <TouchableOpacity
                onPress={createReport}
                style={styles.submitButton}
              >
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setCreateModalVisible(false)}
                style={styles.cancelButton}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </Modal>

      {/* Floating Button */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => setCreateModalVisible(true)}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  reportCard: {
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 10,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  reportComment: {
    fontSize: 14,
    marginBottom: 5,
    color: "#555",
  },
  reportDetails: {
    fontSize: 14,
    color: "#777",
  },
  moreInfoButton: {
    marginTop: 10,
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  moreInfoButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalHeaderText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
    color: "#555",
  },
  boldText: {
    fontWeight: "bold",
  },
  completedText: {
    color: "green",
    fontWeight: "bold",
  },
  incompleteText: {
    color: "red",
    fontWeight: "bold",
  },
  deleteButton: {
    marginTop: 15,
    backgroundColor: "#DC3545",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  closeButton: {
    marginTop: 15,
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  modalWrapper: {
    flex: 1,
    justifyContent: "center", // Centers vertically
    alignItems: "center", // Centers horizontally
  },

  createModalContainer: {
    padding: 20,
    backgroundColor: "rgba(30, 58, 138, 0.8)",
    borderRadius: 20,
    maxHeight: "80%", // Limits height
    width: "90%", // Adjust as needed
  },

  createModalHeader: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#fff",
    textAlign: "center",
  },
  input: {
    backgroundColor: "#3B82F6", // Light blue input fields
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#fff",
    marginBottom: 15,
  },
  picker: {
    backgroundColor: "#2563EB", // Medium blue picker
    borderRadius: 8,
    color: "#fff",
    marginBottom: 15,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "#60A5FA", // Bright blue button
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    marginTop: 10,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#E0E7FF",
    fontSize: 16,
  },
  floatingButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: "blue",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
};

export default ExeReports;
