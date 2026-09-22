import { useEffect, useState } from "react";
import AppNav from "../components/AppNav";

import {
  getProjects,
  createProject,
  getMyProjects,
} from "../service/projectService";

import {
  createProjectProposal,
} from "../service/proposalService";

const categories = [
  "GRAPHICS_DESIGN",
  "WEB_DEVELOPMENT",
  "MOBILE_DEVELOPMENT",
  "DIGITAL_MARKETING",
  "WRITING_TRANSLATION",
  "VIDEO_ANIMATION",
  "AI_ML",
  "DATA_SCIENCE",
];

export default function Projects() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isClient = user?.role === "CLIENT";

  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] =
    useState(null);

  const [projectForm, setProjectForm] = useState({
    title: "",
    requirements: "",
    description: "",
    category: "WEB_DEVELOPMENT",
    budgetMin: "",
    budgetMax: "",
    expectedDeliveryDate: "",
  });

  const [proposalForm, setProposalForm] = useState({
    price: "",
    expectedDeliveryDate: "",
    comment: "",
  });

  const loadProjects = async () => {
    try {
      const data = isClient
        ? await getMyProjects()
        : await getProjects();

      setProjects(data);
    } catch (error) {
      alert(
        error.response?.data ||
          "Failed to load projects."
      );
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();

    if (
      Number(projectForm.budgetMin) >
      Number(projectForm.budgetMax)
    ) {
      alert("Minimum budget cannot exceed maximum budget.");
      return;
    }

    try {
      await createProject({
        ...projectForm,
        budgetMin: Number(projectForm.budgetMin),
        budgetMax: Number(projectForm.budgetMax),
      });

      alert("Project posted successfully.");

      setProjectForm({
        title: "",
        requirements: "",
        description: "",
        category: "WEB_DEVELOPMENT",
        budgetMin: "",
        budgetMax: "",
        expectedDeliveryDate: "",
      });

      loadProjects();
    } catch (error) {
      alert(
        error.response?.data ||
          "Failed to create project."
      );
    }
  };

  const openProposal = (project) => {
    setSelectedProject(project);

    setProposalForm({
      price: project.budgetMin,
      expectedDeliveryDate:
        project.expectedDeliveryDate,
      comment: "",
    });
  };

  const handleProposalSubmit = async (e) => {
    e.preventDefault();

    try {
      await createProjectProposal(
        selectedProject.id,
        {
          price: Number(proposalForm.price),
          expectedDeliveryDate:
            proposalForm.expectedDeliveryDate,
          comment: proposalForm.comment,
        }
      );

      alert("Proposal sent successfully.");
      setSelectedProject(null);
    } catch (error) {
      alert(
        error.response?.data ||
          "Failed to send proposal."
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F5EF]">
      <AppNav />

      <div className="max-w-7xl mx-auto px-6 py-10">
        {isClient ? (
          <>
            <h1 className="text-3xl font-bold">
              My Projects
            </h1>

            <form
              onSubmit={handleCreateProject}
              className="bg-white border rounded-xl p-6 mt-8 max-w-2xl"
            >
              <h2 className="text-xl font-semibold">
                Post a Project
              </h2>

              <input
                placeholder="Project title"
                required
                value={projectForm.title}
                onChange={(e) =>
                  setProjectForm({
                    ...projectForm,
                    title: e.target.value,
                  })
                }
                className="input mt-5"
              />

              <textarea
                placeholder="Requirements"
                required
                value={projectForm.requirements}
                onChange={(e) =>
                  setProjectForm({
                    ...projectForm,
                    requirements: e.target.value,
                  })
                }
                className="input mt-3 min-h-28"
              />

              <textarea
                placeholder="Description"
                required
                value={projectForm.description}
                onChange={(e) =>
                  setProjectForm({
                    ...projectForm,
                    description: e.target.value,
                  })
                }
                className="input mt-3 min-h-28"
              />

              <select
                value={projectForm.category}
                onChange={(e) =>
                  setProjectForm({
                    ...projectForm,
                    category: e.target.value,
                  })
                }
                className="input mt-3"
              >
                {categories.map((category) => (
                  <option
                    key={category}
                    value={category}
                  >
                    {category}
                  </option>
                ))}
              </select>

              <div className="grid grid-cols-2 gap-3 mt-3">
                <input
                  type="number"
                  min="1"
                  required
                  placeholder="Minimum budget"
                  value={projectForm.budgetMin}
                  onChange={(e) =>
                    setProjectForm({
                      ...projectForm,
                      budgetMin: e.target.value,
                    })
                  }
                  className="input"
                />

                <input
                  type="number"
                  min="1"
                  required
                  placeholder="Maximum budget"
                  value={projectForm.budgetMax}
                  onChange={(e) =>
                    setProjectForm({
                      ...projectForm,
                      budgetMax: e.target.value,
                    })
                  }
                  className="input"
                />
              </div>

              <input
                type="date"
                required
                value={projectForm.expectedDeliveryDate}
                onChange={(e) =>
                  setProjectForm({
                    ...projectForm,
                    expectedDeliveryDate:
                      e.target.value,
                  })
                }
                className="input mt-3"
              />

              <button className="btn mt-5">
                Post Project
              </button>
            </form>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold">
              Browse Projects
            </h1>

            <p className="text-gray-500 mt-2">
              Find client projects and send proposals.
            </p>
          </>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white border rounded-xl p-6"
            >
              <p className="text-xs text-[#1F8A70] font-semibold">
                {project.category}
              </p>

              <h2 className="text-xl font-semibold mt-2">
                {project.title}
              </h2>

              <p className="text-sm text-gray-500 mt-3">
                {project.description}
              </p>

              <div className="mt-5">
                ₹{project.budgetMin} - ₹
                {project.budgetMax}
              </div>

              <p className="text-sm text-gray-500">
                Delivery: {project.expectedDeliveryDate}
              </p>

              <p className="text-sm mt-2">
                Client: {project.clientName}
              </p>

              {!isClient && (
                <button
                  onClick={() => openProposal(project)}
                  className="btn mt-5"
                >
                  Send Proposal
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {selectedProject && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-5">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
            <div className="flex justify-between">
              <h2 className="text-xl font-bold">
                Send Proposal
              </h2>

              <button
                onClick={() => setSelectedProject(null)}
              >
                ✕
              </button>
            </div>

            <p className="text-gray-500 mt-2">
              {selectedProject.title}
            </p>

            <form
              onSubmit={handleProposalSubmit}
              className="mt-5"
            >
              <input
                type="number"
                min="1"
                required
                placeholder="Your price"
                value={proposalForm.price}
                onChange={(e) =>
                  setProposalForm({
                    ...proposalForm,
                    price: e.target.value,
                  })
                }
                className="input"
              />

              <input
                type="date"
                required
                value={proposalForm.expectedDeliveryDate}
                onChange={(e) =>
                  setProposalForm({
                    ...proposalForm,
                    expectedDeliveryDate:
                      e.target.value,
                  })
                }
                className="input mt-3"
              />

              <textarea
                placeholder="Comment"
                value={proposalForm.comment}
                onChange={(e) =>
                  setProposalForm({
                    ...proposalForm,
                    comment: e.target.value,
                  })
                }
                className="input mt-3"
              />

              <button className="btn mt-5">
                Send Proposal
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}