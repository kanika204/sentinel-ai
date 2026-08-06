import ContactCard from "./ContactCard";

function ContactList({ contacts, onDelete, onEdit }) {
  if (contacts.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <h2 className="text-2xl font-semibold text-gray-600">
          No Trusted Contacts Added
        </h2>

        <p className="mt-2 text-gray-500">
          Add your first trusted contact using the form above.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {contacts.map((contact) => (
        <ContactCard
          key={contact.id}
          contact={contact}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}

export default ContactList;