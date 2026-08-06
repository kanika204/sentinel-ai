import { useNavigate } from "react-router-dom";

import {
  FaCheckCircle,
  FaUserFriends,
  FaMapMarkerAlt,
  FaRobot,
  FaBell,
  FaClock,
  FaSms,
} from "react-icons/fa";

function NotificationPanel({

  notifications,

  emergencyId,

}) {

  const navigate = useNavigate();

  if (!notifications || notifications.length === 0) {

    return (

      <div className="mt-6 bg-white rounded-2xl shadow-lg p-6">

        <h2 className="text-2xl font-bold text-red-600">

          📨 Notification History

        </h2>

        <p className="mt-4 text-gray-500">

          No notifications available.

        </p>

      </div>

    );

  }

  return (

    <div className="mt-6 bg-white rounded-2xl shadow-lg p-6 border border-green-300">

      <div className="flex items-center gap-3 mb-6">

        <FaBell className="text-red-600 text-2xl"/>

        <h2 className="text-2xl font-bold">

          Notification History

        </h2>

      </div>

      <div className="space-y-5">

        {

          notifications.map((notification) => (

            <div

              key={notification.id}

              className="border rounded-xl p-5 hover:shadow-md transition"

            >

              <div className="flex justify-between items-center">

                <div className="flex items-center gap-3">

                  <FaSms className="text-blue-600 text-xl"/>

                  <div>

                    <h3 className="font-semibold text-lg">

                      {notification.contact_name}

                    </h3>

                    <p className="text-gray-500">

                      {notification.notification_type}

                    </p>

                  </div>

                </div>

                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  notification.status === "DELIVERED"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}>

                  {notification.status}

                </span>

              </div>

              <div className="grid md:grid-cols-2 gap-4 mt-5">

                <div className="flex items-center gap-2">

                  <FaClock className="text-gray-500"/>

                  <span>

                    {notification.sent_at}

                  </span>

                </div>

                <div className="flex items-center gap-2">

                  <FaCheckCircle className="text-green-600"/>

                  Successfully Processed

                </div>

              </div>

            </div>

          ))

        }

      </div>

      <div className="mt-8 grid md:grid-cols-2 gap-4">

        <div className="bg-blue-50 rounded-xl p-4 flex items-center gap-3">

          <FaMapMarkerAlt className="text-red-500"/>

          <span>

            Live GPS Location Attached

          </span>

        </div>

        <div className="bg-indigo-50 rounded-xl p-4 flex items-center gap-3">

          <FaRobot className="text-indigo-600"/>

          <span>

            AI Recommendation Attached

          </span>

        </div>

      </div>

      <button

        onClick={() => navigate(`/contact/${emergencyId}`)}

        className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold"

      >

        Open Trusted Contact Dashboard

      </button>

    </div>

  );

}

export default NotificationPanel;