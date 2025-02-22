# Uber Clone

This project is an Uber clone application developed using React Native, Expo, and Tailwind CSS. It aims to replicate the core functionalities of the Uber app, providing users with a seamless ride-hailing experience.

## Features

- **User Authentication**: Sign up and log in using **Clerk** for authentication.
- **Real-time Location Tracking**: View driver's and rider's locations on an interactive map.
- **Ride Request**: Users can request rides by selecting pickup and drop-off locations.
- **Fare Estimation**: Calculate estimated fares based on distance and time.
- **Ride History**: Access past ride details and receipts.

## Technologies Used

- **React Native**: For building cross-platform mobile applications.
- **Expo**: To streamline the development process and manage builds.
- **Tailwind CSS**: Utilized via the `nativewind` package for styling components.
- **TypeScript**: Ensuring type safety and improved code quality.
- **Clerk**: Provides secure and scalable authentication for users.
- **Neon**: A cloud-native **PostgreSQL database** used as the backend data store.

## Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/AIDK/uber-clone.git
   cd uber-clone
   ```
2. **Install Dependencies**:

   ```bash
   npm install
   ```
3. **Start the Application**:

   ```bash
    npx expo start
   ```

## Project Structure
The project's structure is organized as follows:

   `app/:` Contains the main application components and navigation setup.

   `assets/:` Houses images, icons, and other static resources.
   
   `components/:` Reusable UI components used throughout the app.
   
   `constants/:` Defines constant values and configurations.
   
   `store/:` State management setup, possibly using Redux or Context API.
   
   `types/:` TypeScript type definitions for props, state, and other structures.

## Contributing

Contributions are welcome! If you'd like to enhance this project, please fork the repository, create a new branch, and submit a pull request. Ensure that your code adheres to the project's coding standards and includes relevant tests.

## License

This project is licensed under the MIT License.
 


