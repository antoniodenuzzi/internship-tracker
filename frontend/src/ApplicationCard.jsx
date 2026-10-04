import { useState } from "react"

function ApplicationCard({ application, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false)

  const [editedCompany, setEditedCompany] = useState(application.company)
  const [editedPosition, setEditedPosition] = useState(application.position)
  const [editedStatus, setEditedStatus] = useState(application.status)

  function saveEdit() {
    onEdit(application.id, {
      id: application.id,
      company: editedCompany,
      position: editedPosition,
      status: editedStatus
    })

    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <div className="application-card">
        <input
          value={editedCompany}
          onChange={(event) => {
            setEditedCompany(event.target.value)
          }}
        />

        <input
          value={editedPosition}
          onChange={(event) => {
            setEditedPosition(event.target.value)
          }}
        />

        <select
          value={editedStatus}
          onChange={(event) => {
            setEditedStatus(event.target.value)
          }}
        >
          <option value="Applied">Applied</option>
          <option value="Interview">Interview</option>
          <option value="Offer">Offer</option>
          <option value="Rejected">Rejected</option>
        </select>

        <p className="application-date">
          {new Date(application.application_date + "T00:00:00").toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
          })}
        </p>

        <div className="application-actions">
          <button
            className="edit-button"
            onClick={saveEdit}
          >
            Save
          </button>

          <button
            className="delete-button"
            onClick={() => {
              setIsEditing(false)
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="application-card">
      <h2>{application.company}</h2>

      <p className="application-position">
        {application.position}
      </p>

      <span className={`status-badge ${application.status.toLowerCase()}`}>
        {application.status}
      </span>

      <p className="application-date">
        {new Date(application.application_date + "T00:00:00").toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric"
        })}
      </p>

      <div className="application-actions">
        <button
          className="edit-button"
          onClick={() => {
            setIsEditing(true)
          }}
        >
          Edit
        </button>

        <button
          className="delete-button"
          onClick={() => {
            onDelete(application.id)
          }}
        >
          Delete
        </button>
      </div>
    </div>
  )
}

export default ApplicationCard