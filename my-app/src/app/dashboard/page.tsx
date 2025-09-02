"use client";

import { useUser, useAuth } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { Plus, Search, FileText } from "lucide-react";
import NoteForm from "@/components/NoteForm";
import NoteCard from "@/components/NoteCard";

interface Note {
  id: string;
  title: string;
  content: string;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

// Backend API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export default function Dashboard() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [user]);

  const fetchNotes = async () => {
    try {
      // Get JWT token from Clerk
      const token = await getToken();
      
      const response = await fetch(`${API_BASE_URL}/api/notes`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setNotes(data.notes);
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-indigo-600">NoteFlow</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.firstName || user?.emailAddresses[0]?.emailAddress}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-black w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowNoteForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Note
            </button>
          </div>
        </div>

        {/* Notes Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Notes</h2>
              {filteredNotes.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No notes yet</h3>
                  <p className="mt-1 text-sm text-gray-500">Get started by creating your first note.</p>
                  <button
                    onClick={() => setShowNoteForm(true)}
                    className="mt-6 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Note
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredNotes.map((note) => (
                    <NoteCard
                      key={note.id}
                      note={note}
                      onUpdate={fetchNotes}
                      onDelete={fetchNotes}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Total Notes</span>
                  <span className="text-sm font-semibold text-gray-900">{notes.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Archived Notes</span>
                  <span className="text-sm font-semibold text-gray-500">
                    {notes.filter(note => note.isArchived).length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Note Form Modal */}
      {showNoteForm && (
        <NoteForm
          onClose={() => setShowNoteForm(false)}
          onSave={() => {
            setShowNoteForm(false);
            fetchNotes();
          }}
        />
      )}
    </div>
  );
}
