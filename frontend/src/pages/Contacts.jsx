import { useEffect, useState } from "react";

import ContactForm from "../components/contacts/ContactForm";
import ContactList from "../components/contacts/ContactList";

function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Contact currently being edited
  const [editingContact, setEditingContact] = useState(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  async function fetchContacts() {
    try {
      const response = await fetch("http://127.0.0.1:5000/api/contacts");
      const data = await response.json();

      setContacts(data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setLoading(false);
    }
  }

  // Add Contact
  async function addContact(contactData) {
    try {
      const response = await fetch("http://127.0.0.1:5000/api/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactData),
      });

      const result = await response.json();

      if (result.success) {
        fetchContacts();
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to add contact.");
    }
  }

  // Update Contact
  async function updateContact(id, contactData) {
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/api/contacts/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(contactData),
        }
      );

      const result = await response.json();

      if (result.success) {
        fetchContacts();
        setEditingContact(null);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to update contact.");
    }
  }

  // Delete Contact
  async function deleteContact(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this contact?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://127.0.0.1:5000/api/contacts/${id}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (result.success) {
        fetchContacts();
      }
    } catch (error) {
      console.error(error);
      alert("Failed to delete contact.");
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        Loading Contacts...
      </div>
    );
  }

  return (
  <div className="min-h-screen bg-slate-100">

    <div className="px-8 pt-8">

      <h1 className="text-4xl font-bold mb-8">
        👥 Trusted Contacts
      </h1>

      <ContactForm
        onAddContact={addContact}
        onUpdateContact={updateContact}
        editingContact={editingContact}
        setEditingContact={setEditingContact}
      />

      <div className="mt-8">

        <ContactList
          contacts={contacts}
          onDelete={deleteContact}
          onEdit={setEditingContact}
        />

      </div>

    </div>

  </div>
);
}

export default Contacts;