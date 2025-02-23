import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  Animated,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import api from "../../api";

const AdviserReports = () => {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [refreshing, setRefreshing] = useState(false); // Added for pull-to-refresh
  const slideAnim = useState(new Animated.Value(500))[0];

  const fetchReports = async () => {
    try {
      const response = await api.get("/api/notes/adviser/");
      setReports(response.data);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // Pull-to-Refresh Handler
  const handleRefresh = async () => {
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

  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: 500,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  const toggleCompletionStatus = async () => {
    if (!selectedReport) return;

    setUpdating(true);

    try {
      const updatedStatus = !selectedReport.completed;

      // Optimistically update UI
      setSelectedReport((prev) => ({ ...prev, completed: updatedStatus }));
      setReports((prevReports) =>
        prevReports.map((r) =>
          r.id === selectedReport.id ? { ...r, completed: updatedStatus } : r
        )
      );

      // Send the update to the API
      const response = await api.put(`/api/notes/${selectedReport.id}/`, {
        completed: updatedStatus,
      });

      if (response.status === 200) {
        setSelectedReport(response.data); // Ensure modal has the latest data
        fetchReports(); // Fetch fresh data
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("An error occurred while updating the report.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff", padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>Your Submissions</Text>
      <FlatList
        data={reports}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        renderItem={({ item }) => (
          <View
            style={{
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
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 5 }}>
              {item.damagedProperty.charAt(0).toUpperCase() +
                item.damagedProperty.slice(1)}
            </Text>
            <Text style={{ fontSize: 14, marginBottom: 5, color: "#555" }}>
              Report: {item.comment}
            </Text>
            <Text style={{ fontSize: 14, color: "#777" }}>
              Details: {item.fullName} from {item.gradeSection}
            </Text>

            <TouchableOpacity
              style={{
                marginTop: 10,
                backgroundColor: "#007BFF",
                padding: 10,
                borderRadius: 5,
                alignItems: "center",
              }}
              onPress={() => openModal(item)}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>
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
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "flex-end",
          }}
        >
          <Animated.View
            style={{
              backgroundColor: "#fff",
              padding: 20,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              transform: [{ translateY: slideAnim }],
            }}
          >
            {selectedReport && (
              <>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                    Note Details
                  </Text>
                  <TouchableOpacity onPress={closeModal}>
                    <Ionicons name="close" size={24} color="black" />
                  </TouchableOpacity>
                </View>

                <Text style={{ marginTop: 10 }}>
                  <Text style={{ fontWeight: "bold" }}>Full Name:</Text>{" "}
                  {selectedReport.fullName}
                </Text>
                <Text>
                  <Text style={{ fontWeight: "bold" }}>Grade & Section:</Text>{" "}
                  {selectedReport.gradeSection}
                </Text>
                <Text>
                  <Text style={{ fontWeight: "bold" }}>Submitted on:</Text>{" "}
                  {new Date(selectedReport.dateSubmitted).toLocaleDateString()}
                </Text>
                <Text>
                  <Text style={{ fontWeight: "bold" }}>Damaged Property:</Text>{" "}
                  {selectedReport.damagedProperty || "Not specified"}
                </Text>
                <Text>
                  <Text style={{ fontWeight: "bold" }}>Comment:</Text>{" "}
                  {selectedReport.comment}
                </Text>
                <Text>
                  <Text style={{ fontWeight: "bold" }}>Status:</Text>{" "}
                  {selectedReport.completed ? (
                    <Text style={{ color: "green", fontWeight: "bold" }}>
                      Completed!
                    </Text>
                  ) : (
                    <Text style={{ color: "red", fontWeight: "bold" }}>
                      Not yet completed
                    </Text>
                  )}
                </Text>

                <TouchableOpacity
                  style={{
                    marginTop: 10,
                    backgroundColor: "#007BFF",
                    padding: 10,
                    borderRadius: 5,
                    alignItems: "center",
                  }}
                  onPress={closeModal}
                >
                  <Text style={{ color: "white", fontWeight: "bold" }}>
                    Close
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

export default AdviserReports;
