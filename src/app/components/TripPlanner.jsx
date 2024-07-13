"use client"

import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TripPlanner = () => {
  const [passengers, setPassengers] = useState([
    'John Doe', 'Jane Smith', 'Mike Johnson', 'Emily Brown', 'Chris Lee',
    'Sarah Wilson', 'David Clark', 'Lisa Taylor', 'Tom Anderson', 'Amy White'
  ]);
  const [vehicles, setVehicles] = useState([]);
  const [selectedPassenger, setSelectedPassenger] = useState(null);
  const [newVehicleName, setNewVehicleName] = useState('');
  const [newVehicleCapacity, setNewVehicleCapacity] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const vehicleColors = [
    'bg-blue-100', 'bg-green-100', 'bg-yellow-100', 'bg-red-100', 'bg-purple-100',
    'bg-pink-100', 'bg-indigo-100', 'bg-teal-100', 'bg-orange-100', 'bg-cyan-100'
  ];

  const handlePassengerClick = (passenger) => {
    setSelectedPassenger(passenger === selectedPassenger ? null : passenger);
  };

  const createVehicle = () => {
    if (newVehicleName && newVehicleCapacity) {
      const newVehicle = {
        name: newVehicleName,
        capacity: parseInt(newVehicleCapacity, 10),
        passengers: []
      };
      setVehicles([...vehicles, newVehicle]);
      setNewVehicleName('');
      setNewVehicleCapacity('');
      toast.success('New vehicle added successfully');
    }
  };

  const deleteVehicle = (vehicleIndex) => {
    const updatedVehicles = [...vehicles];
    const deletedVehicle = updatedVehicles.splice(vehicleIndex, 1)[0];
    setVehicles(updatedVehicles);
    setPassengers([...passengers, ...deletedVehicle.passengers]);
    setShowDeleteConfirm(null);
    toast.success('Vehicle deleted successfully');
  };

  const addPassengerToVehicle = (passenger) => {
    let updatedVehicles = [...vehicles];
    let availableVehicle = updatedVehicles.find(v => v.passengers.length < v.capacity);

    if (!availableVehicle) {
      availableVehicle = { name: `Vehicle ${vehicles.length + 1}`, capacity: 4, passengers: [] };
      updatedVehicles.push(availableVehicle);
    }

    availableVehicle.passengers.push(passenger);
    setVehicles(updatedVehicles);
    setPassengers(passengers.filter(p => p !== passenger));
    setSelectedPassenger(null);
    toast.success(`${passenger} added to ${availableVehicle.name}`);
  };

  const removeFromVehicle = (vehicleIndex, passenger) => {
    const updatedVehicles = [...vehicles];
    updatedVehicles[vehicleIndex].passengers = updatedVehicles[vehicleIndex].passengers.filter(p => p !== passenger);
    setVehicles(updatedVehicles);
    setPassengers([...passengers, passenger]);
    toast.info(`${passenger} removed from vehicle`);
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (source.droppableId === 'passengerList' && destination.droppableId === 'passengerList') {
      const updatedPassengers = Array.from(passengers);
      const [movedPassenger] = updatedPassengers.splice(source.index, 1);
      updatedPassengers.splice(destination.index, 0, movedPassenger);
      setPassengers(updatedPassengers);
    }

    if (source.droppableId === 'passengerList' && destination.droppableId.startsWith('vehicle')) {
        const vehicleIndex = parseInt(destination.droppableId.split('-')[1], 10);
        const movedPassenger = passengers[source.index];

        if (vehicles[vehicleIndex].passengers.length < vehicles[vehicleIndex].capacity) {
          const updatedPassengers = Array.from(passengers);
          updatedPassengers.splice(source.index, 1);
          const updatedVehicles = Array.from(vehicles);
          updatedVehicles[vehicleIndex].passengers.push(movedPassenger);
          setPassengers(updatedPassengers);
          setVehicles(updatedVehicles);
          toast.success(`${movedPassenger} added to ${vehicles[vehicleIndex].name}`);
        } else {
          toast.error(`${vehicles[vehicleIndex].name} is full`);
        }
      }

    if (source.droppableId.startsWith('vehicle') && destination.droppableId.startsWith('vehicle')) {
      const sourceVehicleIndex = parseInt(source.droppableId.split('-')[1], 10);
      const destVehicleIndex = parseInt(destination.droppableId.split('-')[1], 10);
      const movedPassenger = vehicles[sourceVehicleIndex].passengers[source.index];
      const updatedVehicles = Array.from(vehicles);

      if (updatedVehicles[destVehicleIndex].passengers.length < updatedVehicles[destVehicleIndex].capacity) {
        if (sourceVehicleIndex === destVehicleIndex) {
          updatedVehicles[sourceVehicleIndex].passengers.splice(source.index, 1);
          updatedVehicles[sourceVehicleIndex].passengers.splice(destination.index, 0, movedPassenger);
        } else {
          updatedVehicles[sourceVehicleIndex].passengers.splice(source.index, 1);
          updatedVehicles[destVehicleIndex].passengers.splice(destination.index, 0, movedPassenger);
        }
        setVehicles(updatedVehicles);
        toast.success(`${movedPassenger} moved to ${vehicles[destVehicleIndex].name}`);
      } else {
        toast.error(`${vehicles[destVehicleIndex].name} is full`);
      }
    }

    if (source.droppableId.startsWith('vehicle') && destination.droppableId === 'passengerList') {
      const vehicleIndex = parseInt(source.droppableId.split('-')[1], 10);
      const movedPassenger = vehicles[vehicleIndex].passengers[source.index];
      const updatedVehicles = Array.from(vehicles);
      updatedVehicles[vehicleIndex].passengers.splice(source.index, 1);
      const updatedPassengers = Array.from(passengers);
      updatedPassengers.splice(destination.index, 0, movedPassenger);
      setVehicles(updatedVehicles);
      setPassengers(updatedPassengers);
      toast.info(`${movedPassenger} removed from ${vehicles[vehicleIndex].name}`);
    }
  };

  const filteredPassengers = passengers.filter(p =>
    p.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditVehicle = (index) => {
    setEditingVehicle({...vehicles[index], index});
  };

  const saveEditedVehicle = () => {
    if (editingVehicle) {
      const updatedVehicles = [...vehicles];
      updatedVehicles[editingVehicle.index] = {
        name: editingVehicle.name,
        capacity: editingVehicle.capacity,
        passengers: editingVehicle.passengers
      };
      setVehicles(updatedVehicles);
      setEditingVehicle(null);
      toast.success('Vehicle updated successfully');
    }
  };

  const confirmDeleteVehicle = (index) => {
    setShowDeleteConfirm(index);
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Escape') {
        setEditingVehicle(null);
        setShowDeleteConfirm(null);
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-1 bg-white rounded-lg p-4">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Passengers</h2>
            <input
              type="text"
              placeholder="Search passengers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 mb-4 border rounded-md"
            />
            <Droppable droppableId="passengerList">
              {(provided, snapshot) => (
                <ul
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`space-y-2 min-h-[200px] max-h-[400px] overflow-y-auto ${
                  snapshot.isDraggingOver ? 'bg-gray-200' : ''
                }`}
                >
                  {filteredPassengers.map((passenger, index) => (
                    <Draggable key={passenger} draggableId={passenger} index={index}>
                      {(provided, snapshot) => (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`p-3 bg-gray-50 rounded-md cursor-pointer text-gray-800 transition-all duration-200 hover:bg-blue-100
                            ${selectedPassenger === passenger ? 'bg-blue-200 border-2 border-blue-500' : 'border-2 border-gray-100'}
                            ${snapshot.isDragging ? 'shadow-lg' : ''}`}
                          onClick={() => handlePassengerClick(passenger)}
                        >
                          <div className="flex justify-between items-center">
                            <span>{passenger}</span>
                            <span className="text-gray-400 text-sm">(Drag)</span>
                          </div>
                        </li>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
            {selectedPassenger && (
              <div className="mt-4">
                <button
                  onClick={() => addPassengerToVehicle(selectedPassenger)}
                  className="w-full py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-200"
                >
                  Add to Available Vehicle
                </button>
              </div>
            )}
          </div>
          <div className="col-span-2">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Vehicles</h2>
            <div className="mb-4 p-4 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3 text-gray-700">Add New Vehicle</h3>
              <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                <input
                  type="text"
                  value={newVehicleName}
                  onChange={(e) => setNewVehicleName(e.target.value)}
                  placeholder="Vehicle Name"
                  className="flex-grow p-2 border rounded-md"
                />
                <input
                  type="number"
                  value={newVehicleCapacity}
                  onChange={(e) => setNewVehicleCapacity(e.target.value)}
                  placeholder="Capacity"
                  className="w-full md:w-24 p-2 border rounded-md"
                />
                <button
                  onClick={createVehicle}
                  className="w-full md:w-auto px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
                >
                  Add Vehicle
                </button>
              </div>
            </div>
            <div className="space-y-6">
              {vehicles.map((vehicle, vehicleIndex) => (
                <Droppable key={vehicleIndex} droppableId={`vehicle-${vehicleIndex}`}>
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={`rounded-lg shadow-md p-6 ${vehicleColors[vehicleIndex % vehicleColors.length]}
                        ${snapshot.isDraggingOver ? 'ring-2 ring-blue-500' : ''}`}
                    >
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-xl font-semibold text-gray-700">
                          {vehicle.name} ({vehicle.passengers.length}/{vehicle.capacity})
                        </h3>
                        <div className="space-x-2">
                          <button
                            onClick={() => handleEditVehicle(vehicleIndex)}
                            className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors duration-200"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => confirmDeleteVehicle(vehicleIndex)}
                            className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <ul className="space-y-2">
                        {vehicle.passengers.map((passenger, passengerIndex) => (
                          <Draggable key={`${passenger}-${vehicleIndex}`} draggableId={`${passenger}-${vehicleIndex}`} index={passengerIndex}>
                            {(provided, snapshot) => (
                              <li
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`p-3 bg-white rounded-md flex justify-between items-center
                                  ${snapshot.isDragging ? 'shadow-lg' : ''}`}
                              >
                                {passenger}
                                <button
                                  onClick={() => removeFromVehicle(vehicleIndex, passenger)}
                                  className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200"
                                >
                                  Remove
                                </button>
                              </li>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </ul>
                    </div>
                  )}
                </Droppable>
              ))}
            </div>
          </div>
        </div>

      </div>
      {editingVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Edit Vehicle</h3>
            <input
              type="text"
              value={editingVehicle.name}
              onChange={(e) => setEditingVehicle({...editingVehicle, name: e.target.value})}
              className="w-full p-2 mb-2 border rounded-md"
            />
            <input
              type="number"
              value={editingVehicle.capacity}
              onChange={(e) => setEditingVehicle({...editingVehicle, capacity: parseInt(e.target.value, 10)})}
              className="w-full p-2 mb-4 border rounded-md"
            />
            <div className="flex justify-end space-x-2">
              <button onClick={() => setEditingVehicle(null)} className="px-4 py-2 bg-gray-300 rounded-md">Cancel</button>
              <button onClick={saveEditedVehicle} className="px-4 py-2 bg-blue-500 text-white rounded-md">Save</button>
            </div>
          </div>
        </div>
      )}
      {showDeleteConfirm !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Confirm Deletion</h3>
            <p>Are you sure you want to delete this vehicle?</p>
            <div className="flex justify-end space-x-2 mt-4">
              <button onClick={() => setShowDeleteConfirm(null)} className="px-4 py-2 bg-gray-300 rounded-md">Cancel</button>
              <button onClick={() => deleteVehicle(showDeleteConfirm)} className="px-4 py-2 bg-red-500 text-white rounded-md">Delete</button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer position="bottom-right" />
    </DragDropContext>
  );
};

export default TripPlanner;
