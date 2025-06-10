
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect, use } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  Platform,
  Modal,
} from "react-native";
import { useSelector } from "react-redux";
// Component chọn dịch vụ kèm theo
function ServiceDialog({
  visible,
  onClose,
  addOnServices,
  selectedServices,
  onServiceChange,
  players,
  selectedServiceTools = {},
  onToolSelect = () => {},
}: {
  visible: boolean;
  onClose: () => void;
  addOnServices: any[];
  selectedServices: { [key: string]: number };
  onServiceChange: (serviceId: string, quantity: number) => void;
  players: number;
  selectedServiceTools?: { [key: string]: string };
  onToolSelect?: (serviceId: string, toolId: string) => void;
}) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.3)",
          justifyContent: "center",
          padding: 20,
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            borderRadius: 16,
            padding: 20,
            maxHeight: "80%",
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              marginBottom: 16,
              color: "#2E7D32",
              textAlign: "center",
            }}
          >
            Chọn dịch vụ kèm theo
          </Text>
          <ScrollView style={{ maxHeight: 350 }}>
            {addOnServices.map((service) => {
              const maxQty = service.maxQuantity || 10;
              const isSelected = (selectedServices[service.id] || 0) > 0;
              const isToolService = service.type === "SINGLE_CLUB" || service.type === "CLUB_SET";
              // Tool selection logic
              const { toolsByType, loading: toolLoading } = useSelector((state: any) => state.tool);
              // selectedServiceTools and onToolSelect are passed as props
              return (
                <View
                  key={service.id}
                  style={{
                    flexDirection: "column",
                    marginBottom: 18,
                    backgroundColor: "#f8f8f8",
                    borderRadius: 10,
                    padding: 10,
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    {/* Checkbox icon */}
                    <TouchableOpacity
                      onPress={() =>
                        onServiceChange(service.id, isSelected ? 0 : 1)
                      }
                      style={{ marginRight: 10 }}
                    >
                      <Ionicons
                        name={isSelected ? "checkbox" : "square-outline"}
                        size={26}
                        color={isSelected ? "#2E7D32" : "#bbb"}
                      />
                    </TouchableOpacity>
                    <Ionicons
                      name={service.icon as any}
                      size={28}
                      color="#2E7D32"
                      style={{ marginRight: 12 }}
                    />
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontWeight: "bold", fontSize: 16 }}>{service.name}</Text>
                      <Text style={{ color: "#666", fontSize: 13 }}>{service.description}</Text>
                      <Text style={{ color: "#2E7D32", fontWeight: "bold", fontSize: 14 }}>
                        {service.price?.toLocaleString("vi-VN")} VNĐ
                        {service.maxQuantity && ` (tối đa ${service.maxQuantity})`}
                      </Text>
                    </View>
                  </View>
                  {/* Tool selection for SINGLE_CLUB/CLUB_SET */}
                  {isSelected && isToolService && (
                    <View style={{ marginTop: 10 }}>
                      <Text style={{ fontWeight: "bold", color: "#2E7D32", marginBottom: 6 }}>
                        Chọn dụng cụ:
                      </Text>
                      {toolLoading && (!toolsByType[service.type] || toolsByType[service.type].length === 0) ? (
                        <Text>Đang tải dụng cụ...</Text>
                      ) : (
                        <ScrollView horizontal style={{ minHeight: 44 }}>
                          {(toolsByType[service.type] || []).map((tool: any) => (
                            <TouchableOpacity
                              key={tool.id}
                              style={{
                                backgroundColor:
                                  selectedServiceTools?.[service.id] === tool.id ? "#2E7D32" : "#f0f0f0",
                                borderRadius: 8,
                                paddingHorizontal: 12,
                                paddingVertical: 8,
                                marginRight: 8,
                              }}
                              onPress={() => onToolSelect(service.id, tool.id)}
                            >
                              <Text
                                style={{
                                  color:
                                    selectedServiceTools?.[service.id] === tool.id ? "white" : "#222",
                                  fontWeight: "bold",
                                }}
                              >
                                {tool.name}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                      )}
                    </View>
                  )}
                  {/* Show quantity controls only if selected */}
                  {isSelected && (
                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
                      <TouchableOpacity
                        style={{
                          backgroundColor: "#f0f0f0",
                          width: 32,
                          height: 32,
                          borderRadius: 16,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        onPress={() =>
                          onServiceChange(
                            service.id,
                            (selectedServices[service.id] || 1) - 1
                          )
                        }
                        disabled={(selectedServices[service.id] || 1) <= 1}
                      >
                        <Ionicons name="remove" size={20} color="#2E7D32" />
                      </TouchableOpacity>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "bold",
                          marginHorizontal: 12,
                          minWidth: 20,
                          textAlign: "center",
                          color: "#333",
                        }}
                      >
                        {selectedServices[service.id] || 1}
                      </Text>
                      <TouchableOpacity
                        style={{
                          backgroundColor: "#f0f0f0",
                          width: 32,
                          height: 32,
                          borderRadius: 16,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        onPress={() =>
                          onServiceChange(
                            service.id,
                            (selectedServices[service.id] || 1) + 1
                          )
                        }
                        disabled={(selectedServices[service.id] || 1) >= maxQty}
                      >
                        <Ionicons name="add" size={20} color="#2E7D32" />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              );
            })}
          </ScrollView>
          <TouchableOpacity
            style={{
              backgroundColor: "#2E7D32",
              padding: 14,
              borderRadius: 10,
              alignItems: "center",
              marginTop: 10,
            }}
            onPress={onClose}
          >
            <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
              Xong
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
export default ServiceDialog;