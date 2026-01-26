"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/common/button";
import { Input } from "@/components/common/input";
import { Label } from "@/components/common/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/common/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/common/tabs";
import { useQuery } from "@tanstack/react-query";
import * as api from "@/lib/api";
import { AppRoutes, OrderStatus } from "@/types/enums";
import { Badge } from "@/components/common/badge";
import { Separator } from "@/components/common/separator";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/common/input-otp";
import {
  Phone,
  ArrowRight,
  User,
  Mail,
  Check,
  ArrowLeft,
  Package,
  MapPin,
  Settings,
  LogOut,
  CreditCard,
  LayoutDashboard,
  Heart
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { colors } from "@/types/colors";

/**
 * Icons for different social/auth providers
 */
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 mr-2" aria-hidden="true">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill={colors.google.blue}
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill={colors.google.green}
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill={colors.google.yellow}
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill={colors.google.red}
    />
  </svg>
);

// Custom hook for localStorage that's SSR-safe
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize from localStorage only on client side
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
      setIsInitialized(true);
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      setIsInitialized(true);
    }
  }, [key]);

  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  const removeValue = () => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue, removeValue];
}

export default function AuthPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn, removeIsLoggedIn] = useLocalStorage<boolean>("isLoggedIn", false);
  const [isMounted, setIsMounted] = useState(false);

  // Login State
  const [loginStep, setLoginStep] = useState<1 | 2>(1);
  const [loginPhone, setLoginPhone] = useState("");
  const [loginOtp, setLoginOtp] = useState("");

  // Signup State
  const [signupStep, setSignupStep] = useState<1 | 2 | 3>(1);
  const [signupPhone, setSignupPhone] = useState("");
  const [signupOtp, setSignupOtp] = useState("");
  const [signupDetails, setSignupDetails] = useState({ firstName: "", lastName: "", email: "" });

  // Account Dashboard State
  const [activeTab, setActiveTab] = useState("overview");

  // Ensure component is mounted before accessing client-side features
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch orders for the "My Orders" section
  const { data: orders = [] } = useQuery({
    queryKey: ['my-orders'],
    queryFn: () => api.fetchOrders(),
    enabled: isLoggedIn && isMounted,
  });

  // Fetch wishlist for the overview section
  const { data: wishlist = [] } = useQuery({
    queryKey: ['wishlist'],
    queryFn: () => api.fetchWishlist(),
    enabled: isLoggedIn && isMounted,
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginStep === 1) {
      if (loginPhone.length < 10) return;
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setLoginStep(2);
      }, 1000);
    } else {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setIsLoggedIn(true);
        router.push(AppRoutes.SHOP);
      }, 1000);
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (signupStep === 1) {
      if (signupPhone.length < 10) return;
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setSignupStep(2);
      }, 1000);
    } else if (signupStep === 2) {
      if (signupOtp.length < 6) return;
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setSignupStep(3);
      }, 1000);
    } else {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setIsLoggedIn(true);
        router.push(AppRoutes.SHOP);
      }, 1500);
    }
  };

  const resetFlows = () => {
    setLoginStep(1);
    setSignupStep(1);
    setLoginPhone("");
    setLoginOtp("");
    setSignupPhone("");
    setSignupOtp("");
    setSignupDetails({ firstName: "", lastName: "", email: "" });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);  
    removeIsLoggedIn();
    router.push(AppRoutes.HOME);
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!isMounted) {
    return null;
  }

  // --- Render Functions for Account Sections ---

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
            <p className="text-xs text-muted-foreground">Lifetime orders</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wishlist</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{wishlist.length}</div>
            <p className="text-xs text-muted-foreground">Saved items</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Addresses</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Saved addresses</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your most recent orders and account actions</CardDescription>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No recent activity.</p>
              <Button size="sm" asChild variant="secondary"><Link href={AppRoutes.SHOP}>Shop Now</Link></Button>
            </div>
          ) : (
            <div className="space-y-8">
              {orders.slice(0, 2).map((order) => (
                <div key={order.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium">Order #{order.id}</p>
                    <p className="text-sm text-muted-foreground">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <Badge variant="outline" className="uppercase">{order.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        {orders.length > 0 && (
          <CardFooter>
            <Button variant="ghost" size="sm" onClick={() => setActiveTab("orders")}>View all orders <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );

  const renderOrders = () => (
    <Card>
      <CardHeader>
        <CardTitle>Order History</CardTitle>
        <CardDescription>View details of your past purchases.</CardDescription>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">You haven't placed any orders yet.</p>
            <Button asChild><Link href={AppRoutes.SHOP}>Start Shopping</Link></Button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="border rounded-lg p-6 hover:bg-muted/30 transition-colors">
                <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
                  <div>
                    <h3 className="font-bold text-lg">Order #{order.id}</h3>
                    <p className="text-sm text-muted-foreground">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant={
                      order.status === OrderStatus.DELIVERED ? 'default' :
                        order.status === OrderStatus.CANCELLED ? 'destructive' : 'secondary'
                    } className="uppercase px-3 py-1">
                      {order.status}
                    </Badge>
                    <p className="font-bold text-lg">${order.total}</p>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-3">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex gap-4 items-center">
                      <div className="w-16 h-20 bg-secondary rounded-sm overflow-hidden flex-shrink-0 border">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {item.selectedColor} / {item.selectedSize}
                        </p>
                      </div>
                      <div className="text-sm font-medium">
                        x{item.quantity}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderAddresses = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Address Book</CardTitle>
          <CardDescription>Manage your shipping and billing addresses.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4 relative group">
              <div className="absolute top-4 right-4 space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" className="h-8 w-8"><Settings className="h-4 w-4" /></Button>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">Default</Badge>
                <span className="font-medium text-sm text-muted-foreground">Home</span>
              </div>
              <p className="font-bold">John Doe</p>
              <p className="text-sm text-muted-foreground">123 Fashion Street</p>
              <p className="text-sm text-muted-foreground">New York, NY 10001</p>
              <p className="text-sm text-muted-foreground mt-2">+1 (555) 123-4567</p>
            </div>

            <div className="border rounded-lg p-4 flex flex-col items-center justify-center min-h-[160px] border-dashed text-muted-foreground hover:bg-muted/30 hover:text-foreground transition-all cursor-pointer">
              <MapPin className="h-8 w-8 mb-2" />
              <p className="font-medium">Add New Address</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSettings = () => (
    <Card>
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
        <CardDescription>Update your personal information and password.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>First Name</Label>
            <Input defaultValue="John" />
          </div>
          <div className="space-y-2">
            <Label>Last Name</Label>
            <Input defaultValue="Doe" />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Email Address</Label>
          <Input defaultValue="john.doe@example.com" />
        </div>
        <div className="space-y-2">
          <Label>Phone Number</Label>
          <Input defaultValue="+1 (555) 000-0000" />
        </div>

        <Separator className="my-2" />

        <div className="space-y-2">
          <h3 className="font-medium">Change Password</h3>
          <div className="grid gap-4 mt-2">
            <div className="space-y-2">
              <Label>Current Password</Label>
              <Input type="password" />
            </div>
            <div className="space-y-2">
              <Label>New Password</Label>
              <Input type="password" />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button>Save Changes</Button>
        </div>
      </CardContent>
    </Card>
  );


  // --- Logged In View ---
  if (isLoggedIn) {
    return (
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="flex flex-col md:flex-row gap-8">

            {/* Sidebar Navigation */}
            <aside className="w-full md:w-64 flex-shrink-0 space-y-6">
              <div className="flex items-center gap-4 px-2">
                <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">
                  JD
                </div>
                <div>
                  <h2 className="font-bold">John Doe</h2>
                  <p className="text-xs text-muted-foreground">Member since 2024</p>
                </div>
              </div>

              <nav className="space-y-1">
                <Button
                  variant={activeTab === "overview" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("overview")}
                >
                  <LayoutDashboard className="mr-2 h-4 w-4" /> Overview
                </Button>
                <Button
                  variant={activeTab === "orders" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("orders")}
                >
                  <Package className="mr-2 h-4 w-4" /> Orders
                </Button>
                <Button
                  variant={activeTab === "addresses" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("addresses")}
                >
                  <MapPin className="mr-2 h-4 w-4" /> Addresses
                </Button>
                <Button
                  variant={activeTab === "settings" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("settings")}
                >
                  <Settings className="mr-2 h-4 w-4" /> Settings
                </Button>
                <Separator className="my-2" />
                <Button
                  variant="ghost"
                  className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" /> Sign Out
                </Button>
              </nav>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 min-h-[500px]">
              <div className="mb-6">
                <h1 className="text-2xl font-heading font-bold uppercase tracking-tight">
                  {activeTab === "overview" && "Account Overview"}
                  {activeTab === "orders" && "Order History"}
                  {activeTab === "addresses" && "My Addresses"}
                  {activeTab === "settings" && "Profile Settings"}
                </h1>
              </div>

              {activeTab === "overview" && renderOverview()}
              {activeTab === "orders" && renderOrders()}
              {activeTab === "addresses" && renderAddresses()}
              {activeTab === "settings" && renderSettings()}
            </main>

          </div>
        </div>
    );
  }

  // --- Guest / Login View ---
  return (
      <div className="container mx-auto px-4 py-24 flex justify-center">
        <Tabs defaultValue="login" className="w-[450px]" onValueChange={resetFlows}>
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          {/* LOGIN CONTENT */}
          <TabsContent value="login">
            <Card className="border-border/60 shadow-lg">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
                <CardDescription className="text-center">
                  Use your phone number to sign in instantly
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-4">
                {loginStep === 1 && (
                  <>
                    <Button variant="outline" className="w-full h-11 relative" onClick={() => { /* Google Auth Mock */ }}>
                      <GoogleIcon />
                      Continue with Google
                    </Button>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">
                          Or continue with phone
                        </span>
                      </div>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="login-phone" className="text-sm font-medium">Phone Number</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="login-phone"
                            type="tel"
                            placeholder="+1 (555) 000-0000"
                            className="pl-9 h-11"
                            value={loginPhone}
                            onChange={(e) => setLoginPhone(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <Button className="w-full h-11 font-medium" type="submit" disabled={isLoading}>
                        {isLoading ? "Sending Code..." : "Send OTP Code"}
                        {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                      </Button>
                    </form>
                  </>
                )}

                {loginStep === 2 && (
                  <form onSubmit={handleLogin} className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                    <div className="text-center space-y-2">
                      <p className="text-sm text-muted-foreground">
                        We sent a code to <span className="font-medium text-foreground">{loginPhone}</span>
                      </p>
                      <Button
                        variant="link"
                        className="text-xs p-0 h-auto"
                        onClick={() => setLoginStep(1)}
                        type="button"
                      >
                        Change number
                      </Button>
                    </div>

                    <div className="flex justify-center py-2">
                      <InputOTP
                        maxLength={6}
                        value={loginOtp}
                        onChange={(value) => setLoginOtp(value)}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPGroup>
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>

                    <Button className="w-full h-11 font-medium" type="submit" disabled={isLoading || loginOtp.length < 6}>
                      {isLoading ? "Verifying..." : "Verify & Login"}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* SIGNUP CONTENT */}
          <TabsContent value="signup">
            <Card className="border-border/60 shadow-lg">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl text-center">Create Account</CardTitle>
                <CardDescription className="text-center">
                  Join our community for exclusive access
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-4">
                {signupStep === 1 && (
                  <>
                    <Button variant="outline" className="w-full h-11" onClick={() => { /* Google Auth Mock */ }}>
                      <GoogleIcon />
                      Sign up with Google
                    </Button>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">
                          Or sign up with phone
                        </span>
                      </div>
                    </div>

                    <form onSubmit={handleSignup} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-phone" className="text-sm font-medium">Phone Number</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="signup-phone"
                            type="tel"
                            placeholder="+1 (555) 000-0000"
                            className="pl-9 h-11"
                            value={signupPhone}
                            onChange={(e) => setSignupPhone(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <Button className="w-full h-11 font-medium" type="submit" disabled={isLoading}>
                        {isLoading ? "Sending..." : "Continue"}
                        {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                      </Button>
                    </form>
                  </>
                )}

                {signupStep === 2 && (
                  <form onSubmit={handleSignup} className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                    <div className="text-center space-y-2">
                      <Label className="text-base font-semibold">Verify Phone</Label>
                      <p className="text-sm text-muted-foreground">
                        Enter the code sent to <span className="font-medium text-foreground">{signupPhone}</span>
                      </p>
                      <Button
                        variant="link"
                        className="text-xs p-0 h-auto"
                        onClick={() => setSignupStep(1)}
                        type="button"
                      >
                        Change number
                      </Button>
                    </div>

                    <div className="flex justify-center py-2">
                      <InputOTP
                        maxLength={6}
                        value={signupOtp}
                        onChange={(value) => setSignupOtp(value)}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPGroup>
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>

                    <Button className="w-full h-11 font-medium" type="submit" disabled={isLoading || signupOtp.length < 6}>
                      {isLoading ? "Verifying..." : "Verify Code"}
                    </Button>
                  </form>
                )}

                {signupStep === 3 && (
                  <form onSubmit={handleSignup} className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                    <div className="text-center mb-6">
                      <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Check className="w-6 h-6" />
                      </div>
                      <h3 className="font-semibold text-lg">Verified!</h3>
                      <p className="text-sm text-muted-foreground">Just a few more details to finish up.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          placeholder="John"
                          value={signupDetails.firstName}
                          onChange={(e) => setSignupDetails({ ...signupDetails, firstName: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          placeholder="Doe"
                          value={signupDetails.lastName}
                          onChange={(e) => setSignupDetails({ ...signupDetails, lastName: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="john@example.com"
                          className="pl-9"
                          value={signupDetails.email}
                          onChange={(e) => setSignupDetails({ ...signupDetails, email: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <Button className="w-full h-11 font-medium mt-2" type="submit" disabled={isLoading}>
                      {isLoading ? "Creating Account..." : "Complete Signup"}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
  );
}