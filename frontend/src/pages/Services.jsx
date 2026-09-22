import { useEffect, useState } from "react";
import AppNav from "../components/AppNav";

import {
  getServices,
  createService,
  getMyServices,
} from "../service/serviceService";

import {
  createServiceProposal,
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

export default function Services() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isFreelancer = user?.role === "FREELANCER";

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [serviceForm, setServiceForm] = useState({
    title: "",
    description: "",
    category: "WEB_DEVELOPMENT",
    price: "",
    deliveryDays: "",
  });

  const [selectedService, setSelectedService] = useState(null);

  const [proposalForm, setProposalForm] = useState({
    requirements: "",
    description: "",
    price: "",
    expectedDeliveryDate: "",
    comment: "",
    attachmentName: "",
    attachmentType: "",
    attachmentSize: "",
  });

  const loadServices = async () => {
    try {
      setLoading(true);

      if (isFreelancer) {
        const data = await getMyServices();
        setServices(data);
      } else {
        const data = await getServices({
          page: 0,
          size: 50,
          sort: "createdAt,desc",
        });

        setServices(data.content || []);
      }
    } catch (error) {
      console.error(error);
      alert(
        error.response?.data ||
          "Failed to load services."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleServiceChange = (e) => {
    setServiceForm({
      ...serviceForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateService = async (e) => {
    e.preventDefault();

    try {
      await createService({
        ...serviceForm,
        price: Number(serviceForm.price),
        deliveryDays: Number(serviceForm.deliveryDays),
      });

      alert("Service created successfully.");

      setServiceForm({
        title: "",
        description: "",
        category: "WEB_DEVELOPMENT",
        price: "",
        deliveryDays: "",
      });

      loadServices();
    } catch (error) {
      alert(
        error.response?.data ||
          "Failed to create service."
      );
    }
  };

  const openProposal = (service) => {
    setSelectedService(service);

    setProposalForm({
      requirements: "",
      description: "",
      price: service.price,
      expectedDeliveryDate: "",
      comment: "",
      attachmentName: "",
      attachmentType: "",
      attachmentSize: "",
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setProposalForm((prev) => ({
      ...prev,
      attachmentName: file.name,
      attachmentType: file.type,
      attachmentSize: file.size,
    }));
  };

  const handleProposalSubmit = async (e) => {
    e.preventDefault();

    try {
      await createServiceProposal(
        selectedService.id,
        {
          requirements: proposalForm.requirements,
          description: proposalForm.description,
          price: Number(proposalForm.price),
          expectedDeliveryDate:
            proposalForm.expectedDeliveryDate,
          comment: proposalForm.comment,
          attachmentName:
            proposalForm.attachmentName || null,
          attachmentType:
            proposalForm.attachmentType || null,
          attachmentSize:
            proposalForm.attachmentSize
              ? Number(proposalForm.attachmentSize)
              : null,
          attachmentUrl: null,
        }
      );

      alert("Work request sent successfully.");
      setSelectedService(null);
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
        {isFreelancer ? (
          <>
            <h1 className="text-3xl font-bold">
              My Services
            </h1>

            <form
              onSubmit={handleCreateService}
              className="bg-white border rounded-xl p-6 mt-8 max-w-2xl"
            >
              <h2 className="text-xl font-semibold mb-5">
                Create Service
              </h2>

              <input
                name="title"
                value={serviceForm.title}
                onChange={handleServiceChange}
                placeholder="Service title"
                required
                className="input"
              />

              <textarea
                name="description"
                value={serviceForm.description}
                onChange={handleServiceChange}
                placeholder="Description"
                required
                className="input mt-3 min-h-28"
              />

              <select
                name="category"
                value={serviceForm.category}
                onChange={handleServiceChange}
                className="input mt-3"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <div className="grid grid-cols-2 gap-3 mt-3">
                <input
                  name="price"
                  type="number"
                  min="1"
                  value={serviceForm.price}
                  onChange={handleServiceChange}
                  placeholder="Price"
                  required
                  className="input"
                />

                <input
                  name="deliveryDays"
                  type="number"
                  min="1"
                  value={serviceForm.deliveryDays}
                  onChange={handleServiceChange}
                  placeholder="Delivery days"
                  required
                  className="input"
                />
              </div>

              <button className="btn mt-5">
                Create Service
              </button>
            </form>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold">
              Browse Services
            </h1>

            <p className="text-gray-500 mt-2">
              Find a freelancer and send a work request.
            </p>
          </>
        )}

        {loading ? (
          <p className="mt-8">Loading...</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-white border rounded-xl p-6"
              >
                <p className="text-xs text-[#1F8A70] font-semibold">
                  {service.category}
                </p>

                <h2 className="text-xl font-semibold mt-2">
                  {service.title}
                </h2>

                <p className="text-gray-500 text-sm mt-3">
                  {service.description}
                </p>

                <div className="mt-5 font-semibold">
                  ₹{service.price}
                </div>

                <p className="text-sm text-gray-500">
                  {service.deliveryDays} days
                </p>

                <p className="text-sm mt-2">
                  Freelancer: {service.freelancerName}
                </p>

                {!isFreelancer && (
                  <button
                    onClick={() => openProposal(service)}
                    className="btn mt-5"
                  >
                    Send Work Request
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedService && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-5">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between">
              <div>
                <h2 className="text-2xl font-bold">
                  Send Work Request
                </h2>
                <p className="text-gray-500">
                  {selectedService.title}
                </p>
              </div>

              <button
                onClick={() => setSelectedService(null)}
                className="text-gray-500"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={handleProposalSubmit}
              className="mt-6"
            >
              <textarea
                placeholder="Requirements"
                required
                value={proposalForm.requirements}
                onChange={(e) =>
                  setProposalForm({
                    ...proposalForm,
                    requirements: e.target.value,
                  })
                }
                className="input min-h-28"
              />

              <textarea
                placeholder="Description"
                required
                value={proposalForm.description}
                onChange={(e) =>
                  setProposalForm({
                    ...proposalForm,
                    description: e.target.value,
                  })
                }
                className="input mt-3 min-h-28"
              />

              <div className="grid grid-cols-2 gap-3 mt-3">
                <input
                  type="number"
                  min="1"
                  value={proposalForm.price}
                  onChange={(e) =>
                    setProposalForm({
                      ...proposalForm,
                      price: e.target.value,
                    })
                  }
                  placeholder="Offered price"
                  required
                  className="input"
                />

                <input
                  type="date"
                  value={
                    proposalForm.expectedDeliveryDate
                  }
                  onChange={(e) =>
                    setProposalForm({
                      ...proposalForm,
                      expectedDeliveryDate:
                        e.target.value,
                    })
                  }
                  required
                  className="input"
                />
              </div>

              <input
                type="file"
                onChange={handleFileChange}
                className="mt-4"
              />

              <textarea
                placeholder="Comment (optional)"
                value={proposalForm.comment}
                onChange={(e) =>
                  setProposalForm({
                    ...proposalForm,
                    comment: e.target.value,
                  })
                }
                className="input mt-3"
              />

              <p className="text-xs text-gray-400 mt-2">
                Attachment metadata is saved for now; actual
                file storage will be wired separately.
              </p>

              <button className="btn mt-5">
                Send Request
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}