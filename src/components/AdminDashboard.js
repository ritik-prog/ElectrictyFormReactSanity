import React, { useEffect, useState } from 'react';
import { client } from '../utils/sanity'
import './AdminDashboard.css';
import { GridLoader } from 'react-spinners';
import { toast } from 'react-toastify';

function AdminDashboard({ setToggle }) {
    const [electricityData, setElectricityData] = useState([]);
    const [Loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            const query = `*[_type == "electricityServiceForm"]`;
            const result = await client.fetch(query);
            setElectricityData(result);
            setLoading(false)
        };
        fetchData();
    }, []);


    const handleDelete = async (id) => {
        setLoading(true)
        const confirmDelete = window.confirm('Are you sure you want to delete this record?');
        if (confirmDelete) {
            try {


                await client.delete(id);
                setElectricityData(electricityData.filter((data) => data._id !== id));
                toast.success(`Record with ID ${id} deleted successfully`, {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            } catch (ex) {
                console.log(ex)
            }
            setLoading(false)
        } else {
            setLoading(false)
        }

    };

    const handleUpdate = (id) => {
        setLoading(true)
        const recordToUpdate = electricityData.find((record) => record._id === id);

        if (!recordToUpdate) {
            alert(`Record with ID ${id} not found`);

            setLoading(false)
            return;
        }

        const updatedRecord = { ...recordToUpdate };

        // Prompt the user for updated values
        updatedRecord.meterNumber = prompt(
            `Enter updated meter number (currently ${recordToUpdate.meterNumber}):`
        ) || recordToUpdate.meterNumber;

        updatedRecord.ownerName = prompt(
            `Enter updated owner name (currently ${recordToUpdate.ownerName}):`
        ) || recordToUpdate.ownerName;

        updatedRecord.date = prompt(
            `Enter updated date (currently ${recordToUpdate.date}):`
        ) || recordToUpdate.date;

        updatedRecord.time = prompt(
            `Enter updated time (currently ${recordToUpdate.time}):`
        ) || recordToUpdate.time;

        updatedRecord.meterReading = prompt(
            `Enter updated meter reading (currently ${recordToUpdate.meterReading}):`
        ) || recordToUpdate.meterReading;

        updatedRecord.houseNumber = prompt(
            `Enter updated house number (currently ${recordToUpdate.houseNumber}):`
        ) || recordToUpdate.houseNumber;

        updatedRecord.phoneNumber = prompt(
            `Enter updated phone number (currently ${recordToUpdate.phoneNumber}):`
        ) || recordToUpdate.phoneNumber;

        updatedRecord.adharNumber = prompt(
            `Enter updated Aadhaar number (currently ${recordToUpdate.adharNumber}):`
        ) || recordToUpdate.adharNumber;

        client
            .patch(id)
            .set(updatedRecord)
            .commit()
            .then(() => {
                toast.success(`Record with ID ${id} updated successfully`, {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
                // Update the state to reflect the updated record
                setElectricityData(
                    electricityData.map((record) =>
                        record._id === id ? { ...record, ...updatedRecord } : record
                    )
                );
                setLoading(false)
            })
            .catch((err) => {
                console.error(`Error updating record with ID ${id}:`, err);

                setLoading(false)
            });
    };

    return (
        <>
            {Loading && <div className="maincontainer">
                <GridLoader color='#36d7b7' />
            </div>}
            {!Loading && <div className="admin-dashboard">
                <header>
                    <button className="submit-btn" onClick={() => setToggle(false)}>Main Form</button>
                </header>
                <h1>Electricity Service Records</h1>
                <table className="electricity-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Meter Number</th>
                            <th>Owner Name</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Meter Reading</th>
                            <th>House Number</th>
                            <th>Phone Number</th>
                            <th>Adhar Number</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {electricityData.map((data) => (
                            <tr key={data._id}>
                                <td>{data._id.slice(1, 3)}...{data._id.slice(6, 9)}</td>
                                <td>{data.meterNumber}</td>
                                <td>{data.ownerName}</td>
                                <td>{data.date}</td>
                                <td>{data.time}</td>
                                <td>{data.meterReading}</td>
                                <td>{data.houseNumber}</td>
                                <td>{data.phoneNumber}</td>
                                <td>{data.adharNumber}</td>
                                <td>
                                    <button onClick={() => handleUpdate(data._id)}>Update</button>
                                </td>
                                <td>
                                    <button onClick={() => handleDelete(data._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>}
        </>
    );
}

export default AdminDashboard;
