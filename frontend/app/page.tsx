"use client";

import { FormEvent, ChangeEvent, useState, useEffect } from "react";
import axios from "axios";

import type { Patient } from "../types";

import { NEXT_PUBLIC_API_URL } from "../utility/constant";

export default function PatientManagement() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [formData, setFormData] = useState<Patient>({
    fullName: "",
    dateOfBirth: "",
    email: "",
    phone: "",
    diagnosisStatus: "Mild",
    notes: ""
  });
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    if (!NEXT_PUBLIC_API_URL) {
      throw new Error("API_URL is not defined");
    }
    const response = await axios.get(`${NEXT_PUBLIC_API_URL}/patients`);
    setPatients(response.data);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (editId !== null) {
      await axios.put(`${NEXT_PUBLIC_API_URL}/patients/${editId}`, formData);
    } else {
      if (NEXT_PUBLIC_API_URL) {
        await axios.post(`${NEXT_PUBLIC_API_URL}/patients`, formData);
      } else {
        throw new Error("API_URL is not defined");
      }
    }
    setFormData({
      fullName: "",
      dateOfBirth: "",
      email: "",
      phone: "",
      diagnosisStatus: "Mild",
      notes: ""
    });
    setEditId(null);
    fetchPatients();
  };

  const handleEdit = (patient: Patient) => {
    setFormData(patient);
    if (patient._id) {
      setEditId(patient._id);
    } else {
      console.error("Patient ID is undefined");
    }
  };
  
  const handleDelete = async (id: string) => {
    if (!id) {
      console.error("Invalid ID for deletion");
      return;
    }
    
    try {
      await axios.delete(`${NEXT_PUBLIC_API_URL}/patients/${id}`);
      fetchPatients();
    } catch (error) {
      console.error("Error deleting patient:", error);
    }
  };
  
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Patient Management</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-gray-100 p-4 rounded">
        <input name="fullName" placeholder="Full Name" value={formData.fullName || ""} onChange={handleChange} className="p-2 w-full border rounded" required />
        <input type="date" name="dateOfBirth" value={formData.dateOfBirth || ""} onChange={handleChange} className="p-2 w-full border rounded" required />
        <input name="email" placeholder="Email" value={formData.email || ""} onChange={handleChange} className="p-2 w-full border rounded" required />
        <input name="phone" placeholder="Phone" value={formData.phone || ""} onChange={handleChange} className="p-2 w-full border rounded" required />
        <select name="diagnosisStatus" value={formData.diagnosisStatus || "Mild"} onChange={handleChange} className="p-2 w-full border rounded">
          <option value="Mild">Mild</option>
          <option value="Moderate">Moderate</option>
          <option value="Severe">Severe</option>
        </select>
        <textarea name="notes" placeholder="Additional Notes" value={formData.notes || ""} onChange={handleChange} className="p-2 w-full border rounded"></textarea>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">{editId !== null ? "Update" : "Add"} Patient</button>
      </form>

      <table className="w-full mt-6 border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Name</th>
            <th className="border p-2">Contact</th>
            <th className="border p-2">Diagnosis</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr key={patient._id} className="border">
              <td className="border p-2">{patient.fullName}</td>
              <td className="border p-2">{patient.email}, {patient.phone}</td>
              <td className="border p-2">{patient.diagnosisStatus}</td>
              <td className="border p-2 space-x-2">
                <button onClick={() => handleEdit(patient)} className="bg-yellow-500 text-white px-2 py-1 rounded">Edit</button>
                <button onClick={() => patient._id && handleDelete(patient._id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
