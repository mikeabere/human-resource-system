import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Card from "../components/common/Card";
import Table from "../components/common/Table";
import Alert from "../components/common/Alert";
import Loader from "../components/common/Loader";
import { performanceService } from "../services/performanceService";
import "./Performance.css";

const Performance = () => {
  const { user, isAdmin, isHR } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      let data;

      if (isAdmin || isHR) {
        data = await performanceService.getAllReviews({ limit: 20 });
      } else {
        data = await performanceService.getMyReviews({ limit: 20 });
      }

      setReviews(data.data);
    } catch (error) {
      showAlert("error", "Failed to fetch performance reviews");
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  const columns = [
    {
      header: "Review Period",
      accessor: "reviewPeriod",
      render: (value) => {
        const start = new Date(value.startDate).toLocaleDateString();
        const end = new Date(value.endDate).toLocaleDateString();
        return `${start} - ${end}`;
      },
    },
    {
      header: "Review Type",
      accessor: "reviewType",
      render: (value) => <span className="review-type">{value}</span>,
    },
    {
      header: "Overall Rating",
      accessor: "overallRating",
      render: (value) => (
        <div className="rating-display">
          <span className="rating-stars">{"⭐".repeat(Math.round(value))}</span>
          <span className="rating-value">{value?.toFixed(1) || "N/A"}</span>
        </div>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      render: (value) => (
        <span className={`status-badge status-${value}`}>{value}</span>
      ),
    },
  ];

  if (isAdmin || isHR) {
    columns.unshift({
      header: "Employee",
      accessor: "employee",
      render: (value) => value?.firstName + " " + value?.lastName,
    });
  }

  if (loading) {
    return <Loader fullScreen />;
  }

  return (
    <div className="performance-page">
      <div className="page-header">
        <h1>Performance Reviews</h1>
      </div>

      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      <Card title="Review History">
        <Table columns={columns} data={reviews} />
      </Card>

      {reviews.length === 0 && (
        <Card>
          <p className="text-center text-gray">No performance reviews found.</p>
        </Card>
      )}
    </div>
  );
};

export default Performance;
