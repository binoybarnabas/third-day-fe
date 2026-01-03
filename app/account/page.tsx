import { redirect } from 'next/navigation';
import { AppRoutes } from '@/types/enums'; // Assuming AppRoutes.LOGIN is '/login'
// Assume you have a function to check auth status on the server
// import { checkAuthStatus } from '@/lib/auth'; 

export default async function AccountPage() {
  // 1. Check authentication status (Server-side check)
  // This function must securely check cookies or sessions on the server.
//   const isAuthenticated = await checkAuthStatus(); 

  // 2. If not authenticated, redirect to the login page
//   if (!isAuthenticated) {
    // The 'redirect' function throws an error that Next.js catches 
    // to perform a server-side redirect.
    redirect(AppRoutes.LOGIN); 
//   }

  // 3. If authenticated, render the protected content
  return (
    <div>
      <h1>Welcome to Your Account Dashboard</h1>
      {/* ... account content ... */}
    </div>
  );
}