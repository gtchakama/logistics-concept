# Trip Planner

Trip Planner is a Next.js-based web application that helps users organize passengers into vehicles for group trips. It provides an intuitive drag-and-drop interface for easy management of passengers and vehicles.

## Features

- Add and manage passengers
- Create, edit, and delete vehicles
- Drag-and-drop functionality for assigning passengers to vehicles
- Search functionality for finding specific passengers
- Real-time updates on vehicle capacity
- Responsive design for various screen sizes

## Technologies Used

- Next.js
- React
- react-beautiful-dnd (for drag-and-drop functionality)
- react-toastify (for notifications)
- Tailwind CSS (for styling)

## Getting Started

### Prerequisites

- Node.js (version 12 or higher)
- npm (usually comes with Node.js)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/gtchakama/logistics-concept.git
   ```

2. Navigate to the project directory:
   ```
   cd logistics-concept
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. Open your browser and visit `http://localhost:3000` to see the application.

## Usage

1. **Add Passengers**: The left panel displays a list of passengers. You can add new passengers by editing the initial state in the code.

2. **Create Vehicles**: Use the "Add New Vehicle" form to create vehicles with a name and passenger capacity.

3. **Assign Passengers**: Drag passengers from the left panel to the vehicle cards on the right. You can also drag passengers between vehicles.

4. **Edit Vehicles**: Click the "Edit" button on a vehicle card to modify its name or capacity.

5. **Remove Passengers**: Click the "Remove" button next to a passenger in a vehicle to return them to the unassigned list.

6. **Delete Vehicles**: Click the "Delete" button on a vehicle card to remove it and return its passengers to the unassigned list.

7. **Search Passengers**: Use the search bar above the passenger list to filter passengers by name.

## Use Cases and Potential Modifications

1. **School Field Trips**: Organize students into buses for field trips. Modify to include additional fields like grade level or emergency contact information.

2. **Corporate Event Planning**: Arrange employees into transportation for company retreats or events. Add fields for departments or dietary preferences.

3. **Sports Team Management**: Organize players into vehicles for away games. Modify to include positions or equipment requirements.

4. **Tour Group Management**: Arrange tourists into different tour vehicles. Add fields for language preferences or mobility requirements.

5. **Wedding Planning**: Organize guests into transportation for different wedding events. Modify to include relationship to bride/groom or meal preferences.

6. **Conference Logistics**: Manage attendees' transportation to different conference venues. Add fields for session tracks or networking preferences.

7. **Disaster Relief Coordination**: Organize relief workers or evacuees into vehicles. Modify to include skills or medical needs.

8. **Restaurant Table Management**: Adapt the concept to arrange diners into tables. Modify vehicles to represent tables with different capacities.

9. **Volunteer Event Coordination**: Organize volunteers into teams or work areas. Add fields for skills or availability.

10. **Military Logistics**: Arrange personnel into different transport vehicles. Add fields for rank or specialization.

To implement these use cases, consider adding more fields to the passenger and vehicle data structures, implementing a backend for data persistence, and adding authentication for multi-user scenarios.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
