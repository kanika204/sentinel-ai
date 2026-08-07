import { useEffect, useState } from "react";

function ContactForm({
  onAddContact,
  onUpdateContact,
  editingContact,
  setEditingContact,
}) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    relationship: "",
    is_primary: false,
  });

  // Populate form when Edit is clicked
  useEffect(() => {
    if (editingContact) {
      setFormData({
        name: editingContact.name,
        phone: editingContact.phone,
        relationship: editingContact.relationship || "",
        is_primary: editingContact.is_primary,
      });
    }
  }, [editingContact]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function resetForm() {
    setFormData({
      name: "",
      phone: "",
      relationship: "",
      is_primary: false,
    });

    setEditingContact(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!formData.name.trim() || !formData.phone.trim()) {
      alert("Name and Phone are required.");
      return;
    }

    if (editingContact) {
      await onUpdateContact(editingContact.id, formData);
    } else {
      await onAddContact(formData);
    }

    resetForm();
  }

  return (
  <div className="bg-white rounded-2xl shadow-lg mb-8"
  style={{ padding: "32px" }}>

    <h2 className="text-2xl font-bold text-slate-800 mb-8">
      {editingContact ? "Edit Contact" : "Add Trusted Contact"}
    </h2>

    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >

      {/* Name */}
      <div>

        <label className="block mb-2 font-semibold text-gray-700">
          Name
        </label>

        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter contact name"
          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        />

      </div>

      {/* Phone */}
      <div>

        <label className="block mb-2 font-medium">
          Phone Number
        </label>

        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Enter phone number"
          className="w-full border rounded-lg p-3"
        />

      </div>

      {/* Relationship */}
      <div>

        <label className="block mb-2 font-medium">
          Relationship
        </label>

        <input
          type="text"
          name="relationship"
          value={formData.relationship}
          onChange={handleChange}
          placeholder="Friend, Brother, Parent..."
          className="w-full border rounded-lg p-3"
        />

      </div>

      {/* Primary Contact */}
      <div className="flex items-center gap-3 pt-2">

        <input
          type="checkbox"
          name="is_primary"
          checked={formData.is_primary}
          onChange={handleChange}
        />

        <label>
          Primary Contact
        </label>

      </div>

      {/* Buttons */}
      <div className="flex gap-4">

        <button
          type="submit"
          className={`flex-1 py-3 rounded-xl font-semibold text-white transition duration-200 ${
            editingContact
              ? "bg-yellow-500 hover:bg-yellow-600"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {editingContact ? "Update Contact" : "Add Contact"}
        </button>

        {editingContact && (
          <button
            type="button"
            onClick={resetForm}
            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg transition"
          >
            Cancel
          </button>
        )}

      </div>

    </form>

  </div>
);
}

export default ContactForm;