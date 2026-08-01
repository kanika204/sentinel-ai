import { FaUser, FaPhoneAlt, FaTrash, FaStar, FaEdit } from "react-icons/fa";

function ContactCard({ contact, onDelete, onEdit }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition duration-300">

      {/* Header */}
      <div className="flex items-center justify-between">

        <div className="flex items-center gap-3">

          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
            <FaUser className="text-blue-600 text-xl" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-800">
              {contact.name}
            </h2>

            <p className="text-gray-500">
              {contact.relationship || "Trusted Contact"}
            </p>
          </div>

        </div>

        {contact.is_primary && (
          <FaStar
            className="text-yellow-500 text-xl"
            title="Primary Contact"
          />
        )}

      </div>

      {/* Phone */}
      <div className="mt-5 flex items-center gap-3">
        <FaPhoneAlt className="text-green-600" />

        <span className="text-lg text-gray-700">
          {contact.phone}
        </span>
      </div>

      {/* Footer */}
      <div className="mt-6 flex justify-end gap-3">

        <button
          onClick={() => onEdit(contact)}
          className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition"
        >
          <FaEdit />
          Edit
        </button>

        <button
          onClick={() => onDelete(contact.id)}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
        >
          <FaTrash />
          Delete
        </button>

      </div>

    </div>
  );
}

export default ContactCard;