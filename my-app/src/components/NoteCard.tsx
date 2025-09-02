"use client";

import { useState } from "react";
import { Edit, Trash2, MoreVertical, Calendar } from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "@clerk/nextjs";
import NoteForm from "./NoteForm";

interface Note {
  id: string;
  title: string;
  content: string;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

interface NoteCardProps {
  note: Note;
  onUpdate: () => void;
  onDelete: () => void;
}

export default function NoteCard({ note, onUpdate, onDelete }: NoteCardProps) {
  const { getToken } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Backend API base URL
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this note?")) return;
    
    setIsDeleting(true);
    try {
      // Get JWT token from Clerk
      const token = await getToken();
      
      const response = await fetch(`${API_BASE_URL}/api/notes/${note.id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        onDelete();
      } else {
        console.error("Failed to delete note");
      }
    } catch (error) {
      console.error("Error deleting note:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const truncatedContent = note.content.length > 150 
    ? note.content.substring(0, 150) + "..." 
    : note.content;

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
              {note.title}
            </h3>
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
              >
                <MoreVertical className="h-4 w-4" />
              </button>
              
              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        setShowEditForm(true);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        handleDelete();
                      }}
                      disabled={isDeleting}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      {isDeleting ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
            {truncatedContent}
          </p>
          
          <div className="flex items-center text-xs text-gray-400">
            <Calendar className="h-3 w-3 mr-1" />
            <span>
              Created: {format(new Date(note.createdAt), "MMM d, yyyy")}
            </span>
            {note.updatedAt !== note.createdAt && (
              <span className="ml-4">
                Updated: {format(new Date(note.updatedAt), "MMM d, yyyy")}
              </span>
            )}
          </div>
        </div>
      </div>

      {showEditForm && (
        <NoteForm
          note={note}
          onClose={() => setShowEditForm(false)}
          onSave={() => {
            setShowEditForm(false);
            onUpdate();
          }}
        />
      )}
    </>
  );
}
