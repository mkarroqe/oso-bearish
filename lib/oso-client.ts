import { Oso } from 'oso';
import type { Stock } from '@/types/stock';
import type { User } from '@/types/user';

// Create a class for Oso to use at runtime
// Oso needs actual JavaScript classes, not TypeScript interfaces
class OsoUser {
  id: string;
  role: string;
  firstName?: string;
  lastName?: string;

  constructor(user: User) {
    this.id = user.id;
    this.role = user.role;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
  }
}

class OsoStock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  recommendation: string;
  isBasic: boolean;

  constructor(stock: Stock) {
    this.symbol = stock.symbol;
    this.name = stock.name;
    this.price = stock.price;
    this.change = stock.change;
    this.changePercent = stock.changePercent;
    this.volume = stock.volume;
    this.marketCap = stock.marketCap;
    this.recommendation = stock.recommendation;
    this.isBasic = stock.isBasic;
  }
}

class OsoRecommendation {
  _type: string = 'Recommendation';
}

// Our policy rules as a string (for Next.js compatibility)
const POLICY = `
# Define actors and resources
actor User {}
resource Stock {}
resource Recommendation {}

# BASIC USERS
# Can only view limited stocks
allow(user: User, "view", stock: Stock) if 
    user.role = "basic" and
    stock.isBasic = true;

# PREMIUM USERS  
# Can view all stocks and recommendations
allow(user: User, "view", _: Stock) if 
    user.role = "premium";
allow(user: User, "view", _: Recommendation) if 
    user.role = "premium";

# ANALYST USERS
# Premium + can modify recommendations
allow(user: User, "view", _: Stock) if 
    user.role = "analyst";
allow(user: User, "view", _: Recommendation) if 
    user.role = "analyst";
allow(user: User, "modify", _: Recommendation) if 
    user.role = "analyst";

# ADMIN USERS
# Analyst + can modify stocks
allow(user: User, "view", _: Stock) if 
    user.role = "admin";
allow(user: User, "view", _: Recommendation) if 
    user.role = "admin";
allow(user: User, "modify", _: Recommendation) if 
    user.role = "admin";
allow(user: User, "modify", _: Stock) if 
    user.role = "admin";
`;

// Create and configure Oso instance
let osoInstance: Oso | null = null;

export function getOso(): Oso {
  if (!osoInstance) {
    try {
      console.log('Initializing Oso...');
      osoInstance = new Oso();
      
      // Register our classes (needs to be actual classes, not interfaces)
      console.log('Registering classes...');
      osoInstance.registerClass(OsoUser, { name: 'User' });
      osoInstance.registerClass(OsoStock, { name: 'Stock' });
      osoInstance.registerClass(OsoRecommendation, { name: 'Recommendation' });
      
      // Load the policy directly from string
      console.log('Loading policy...');
      osoInstance.loadStr(POLICY);
      console.log('Oso initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Oso:', error);
      throw error;
    }
  }
  
  return osoInstance;
}

// Helper functions for authorization checks
export async function canViewStock(user: User, stock: Stock): Promise<boolean> {
  const oso = getOso();
  const osoUser = new OsoUser(user);
  const osoStock = new OsoStock(stock);
  return oso.isAllowed(osoUser, 'view', osoStock);
}

export async function canViewRecommendation(user: User): Promise<boolean> {
  const oso = getOso();
  const osoUser = new OsoUser(user);
  const recommendation = new OsoRecommendation();
  return oso.isAllowed(osoUser, 'view', recommendation);
}

export async function canModifyRecommendation(user: User): Promise<boolean> {
  const oso = getOso();
  const osoUser = new OsoUser(user);
  const recommendation = new OsoRecommendation();
  return oso.isAllowed(osoUser, 'modify', recommendation);
}

export async function canModifyStock(user: User): Promise<boolean> {
  const oso = getOso();
  const osoUser = new OsoUser(user);
  // For modify checks, we don't need a specific stock instance
  // Just checking if user can modify any stock
  const stock = new OsoStock({
    symbol: '',
    name: '',
    price: 0,
    change: 0,
    changePercent: 0,
    volume: 0,
    marketCap: 0,
    recommendation: 'hold',
    isBasic: false
  });
  return oso.isAllowed(osoUser, 'modify', stock);
}

// Get all permissions for a user
export async function getUserPermissions(user: User) {
  try {
    console.log('Getting permissions for user:', user.id, user.role);
    
    const [canViewRecs, canModifyRecs, canModifyStocks] = await Promise.all([
      canViewRecommendation(user),
      canModifyRecommendation(user),
      canModifyStock(user)
    ]);

    const permissions = {
      canViewAllStocks: user.role !== 'basic',
      canViewRecs,
      canModifyRecs,
      canModifyStocks
    };
    
    console.log('Permissions calculated:', permissions);
    return permissions;
  } catch (error) {
    console.error('Error in getUserPermissions:', error);
    throw error;
  }
}