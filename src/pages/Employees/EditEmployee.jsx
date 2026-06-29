import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EmployeeForm from './EmployeeForm';
import { useEmployeeContext } from '../../context/EmployeeContext';
import { ROUTES } from '../../constants/routes';

const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getEmployee } = useEmployeeContext();
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const data = await getEmployee(id);
      setEditData(data);
      setLoading(false);
    };
    fetch();
  }, [id, getEmployee]);

  if (loading) return <p className="text-text-secondary">Loading...</p>;
  if (!editData) return <p className="text-text-secondary">Employee not found</p>;

  return (
    <>
      <div>
        <h1 className="text-2xl font-bold text-text">Edit Employee</h1>
        <p className="text-text-secondary text-sm mt-1">Update employee information</p>
      </div>
      <EmployeeForm editData={editData} onCancel={() => navigate(ROUTES.EMPLOYEES)} />
    </>
  );
};

export default EditEmployee;
