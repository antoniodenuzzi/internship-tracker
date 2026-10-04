import { useState, useEffect } from "react"
import ApplicationCard from "./ApplicationCard"
import "./App.css"

function App() {
  const [applications, setApplications] = useState([])

  const [company, setCompany] = useState("")
  const [position, setPosition] = useState("")
  const [status, setStatus] = useState("")
  const [filter, setFilter] = useState("All")
  const [search, setSearch] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    fetch("http://127.0.0.1:8000/applications")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load applications")
        }

        return response.json()
      })
      .then((data) => {
        setApplications(data)
        setError("")
      })
      .catch((err) => {
        console.log(err)
        setError("Failed to load applications. Please try again.")
      })
  },[])

  function deleteApplication(id) {
    fetch(`http://127.0.0.1:8000/applications/${id}`, {
      method: "DELETE"
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to delete application")
      }

      return response.json()
    })
    .then((deletedApplication) => {
      setApplications(
        applications.filter((application) => {
          return application.id !== id
        })
      )
      setError("")
    })
    .catch((err) => {
      console.log(err)
      setError("Failed to delete application. Please try again.")
    })
  }

  function editApplication(id, updatedApplication) {
    fetch(`http://127.0.0.1:8000/applications/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updatedApplication)
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to edit application")

      }
      return response.json()
    })
    .then((savedApplication) => {
      setApplications(
        applications.map((application) => {
          if (application.id === id) {
            return savedApplication
          }
          
          return application
        })
      )
      setError("")
    })
    .catch((err) => {
      console.log(err)
      setError("Failed to edit application. Please try again.")
    })
  }


  return (
    <div className="app">
      <h1>Internship Tracker</h1>
      <p>Track your internship applications.</p>

      {error && (
        <p className="error-message">
          {error}
        </p>
      )}

      <div className="application-form">
        <input
          placeholder="Company"
          value={company}
          onChange={(event) => {
            setCompany(event.target.value)
          }}
        />

        <input
          placeholder="Position"
          value={position}
          onChange={(event) => {
            setPosition(event.target.value)
          }}
        />

        <select
          value={status}
          onChange={(event) => {
            setStatus(event.target.value)
          }}
        >
          <option value="">Select Status</option>
          <option value="Applied">Applied</option>
          <option value="Interview">Interview</option>
          <option value="Offer">Offer</option>
          <option value="Rejected">Rejected</option>
        </select>

        <button
          onClick={() => {
            if (company === "" || position === "" || status === "") {
              return
            }

            fetch("http://127.0.0.1:8000/applications", {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                company: company,
                position: position, 
                status: status
              })
            })
            .then((response) => {
              if (!response.ok){
                throw new Error("Failed to add application")
              }

              return response.json()
            })
            .then((newApplication) => {
              setApplications([
                ...applications, 
                newApplication
              ])

              setCompany("")
              setPosition("")
              setStatus("")
              setError("")
            })
            .catch((err) => {
              console.log(err)
              setError("Failed to add application. Please try again.")
            })

          }}
        >
          Add Application
        </button>
      </div>

      <div className="stats">
        <div className="stat">
          <strong>
            {applications.filter((application) => {
              return application.status === "Applied"
            }).length}
          </strong>
          <span>Applied</span>
        </div>

        <div className="stat">
          <strong>
            {applications.filter((application) => {
              return application.status === "Interview"
            }).length}
          </strong>
          <span>Interviews</span>
        </div>

        <div className="stat">
          <strong>
            {applications.filter((application) => {
              return application.status === "Offer"
            }).length}
          </strong>
          <span>Offers</span>
        </div>
      </div>

      <div className="filters">
        <input 
          placeholder="Search applications..."
          value={search}
          onChange={(event) => {
            setSearch(event.target.value)
          }}
        />

        <span>Filter by:</span>
        <select
          value={filter}
          onChange={(event) => {
            setFilter(event.target.value)
          }}
        >
          <option value="All">All</option>
          <option value="Applied">Applied</option>
          <option value="Interview">Interview</option>
          <option value="Offer">Offer</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      <div className="applications-heading">
        <h2>Applications</h2>
        <span>{applications.length} total</span>
      </div>

      <div className="application-header">
        <span>Company</span>
        <span>Position</span>
        <span>Status</span>
        <span>Date Applied</span>
        <span>Actions</span>
      </div>

      {applications
        .filter((application) => {
          if (filter === "All") {
            return true
          }

          return application.status === filter
        })
        .filter((application) => {
          return application.company.toLowerCase().includes(search.toLowerCase()) || application.position.toLowerCase().includes(search.toLowerCase())

        })
        .map((application) => {
          return (
            <ApplicationCard
              key={application.id}
              application={application}
              onDelete={deleteApplication}
              onEdit={editApplication}
            />
          )
        })}
    </div>
  )
}

export default App