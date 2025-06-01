
import { users, cards, templates, presentations, slides, type User, type InsertUser, type Card, type InsertCard, type Template, type InsertTemplate, type Presentation, type InsertPresentation, type Slide, type InsertSlide } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Card methods
  getCard(id: number): Promise<Card | undefined>;
  getAllCards(): Promise<Card[]>;
  createCard(card: InsertCard): Promise<Card>;
  updateCard(id: number, card: Partial<InsertCard>): Promise<Card | undefined>;
  deleteCard(id: number): Promise<boolean>;
  
  // Template methods
  getTemplate(id: number): Promise<Template | undefined>;
  getAllTemplates(): Promise<Template[]>;
  createTemplate(template: InsertTemplate): Promise<Template>;
  updateTemplate(id: number, template: Partial<InsertTemplate>): Promise<Template | undefined>;
  deleteTemplate(id: number): Promise<boolean>;
  
  // Presentation methods
  getPresentation(id: number): Promise<Presentation | undefined>;
  getAllPresentations(): Promise<Presentation[]>;
  createPresentation(presentation: InsertPresentation): Promise<Presentation>;
  updatePresentation(id: number, presentation: Partial<InsertPresentation>): Promise<Presentation | undefined>;
  deletePresentation(id: number): Promise<boolean>;
  
  // Slide methods
  getSlide(id: number): Promise<Slide | undefined>;
  getSlidesByPresentation(presentationId: number): Promise<Slide[]>;
  createSlide(slide: InsertSlide): Promise<Slide>;
  updateSlide(id: number, slide: Partial<InsertSlide>): Promise<Slide | undefined>;
  deleteSlide(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private cards: Map<number, Card>;
  private templates: Map<number, Template>;
  private presentations: Map<number, Presentation>;
  private slides: Map<number, Slide>;
  private currentUserId: number;
  private currentCardId: number;
  private currentTemplateId: number;
  private currentPresentationId: number;
  private currentSlideId: number;

  constructor() {
    this.users = new Map();
    this.cards = new Map();
    this.templates = new Map();
    this.presentations = new Map();
    this.slides = new Map();
    this.currentUserId = 1;
    this.currentCardId = 1;
    this.currentTemplateId = 1;
    this.currentPresentationId = 1;
    this.currentSlideId = 1;
    this.initializeData();
  }

  private initializeData() {
    // Create default presentation
    const defaultPresentation = this.createPresentation({
      title: "Sample Presentation",
      description: "A sample presentation to get started",
    });

    // Create default slides
    setTimeout(() => {
      this.createSlide({
        presentationId: 1,
        title: "Welcome Slide",
        content: { type: "title", text: "Welcome to our presentation" },
        position: 0,
      });
      
      this.createSlide({
        presentationId: 1,
        title: "Content Slide",
        content: { type: "content", text: "Here's some content" },
        position: 1,
      });
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getCard(id: number): Promise<Card | undefined> {
    return this.cards.get(id);
  }

  async getAllCards(): Promise<Card[]> {
    return Array.from(this.cards.values());
  }

  async createCard(insertCard: InsertCard): Promise<Card> {
    const id = this.currentCardId++;
    const now = new Date();
    const card: Card = {
      id,
      title: insertCard.title || "Modern Card",
      description: insertCard.description || "Live preview with real-time updates",
      bgGradientFrom: insertCard.bgGradientFrom || "#523091",
      bgGradientTo: insertCard.bgGradientTo || "#1a0b33",
      bgOpacityFrom: insertCard.bgOpacityFrom || 70,
      bgOpacityTo: insertCard.bgOpacityTo || 14,
      shadowColor: insertCard.shadowColor || "#7c3aed",
      shadowOpacity: insertCard.shadowOpacity || 0.3,
      enableHoverEffects: insertCard.enableHoverEffects ?? true,
      enableAnimations: insertCard.enableAnimations ?? true,
      cardWidth: insertCard.cardWidth || 320,
      cardHeight: insertCard.cardHeight || 200,
      cardPadding: insertCard.cardPadding || 24,
      cardBorderRadius: insertCard.cardBorderRadius || {
        topLeft: 16,
        topRight: 16,
        bottomLeft: 16,
        bottomRight: 16,
        unit: "px",
      },
      cardOpacity: insertCard.cardOpacity || 100,
      shadowSettings: insertCard.shadowSettings || {
        x: 0,
        y: 30,
        blur: 50,
        spread: 0,
      },
      titleFont: insertCard.titleFont || "Inter",
      titleSize: insertCard.titleSize || 18,
      titleWeight: insertCard.titleWeight || "600",
      titleAlign: insertCard.titleAlign || "left",
      descriptionFont: insertCard.descriptionFont || "Inter",
      descriptionSize: insertCard.descriptionSize || 14,
      descriptionWeight: insertCard.descriptionWeight || "400",
      descriptionAlign: insertCard.descriptionAlign || "left",
      rotation: insertCard.rotation || 0,
      scaleX: insertCard.scaleX || 1,
      scaleY: insertCard.scaleY || 1,
      blur: insertCard.blur || 0,
      brightness: insertCard.brightness || 100,
      contrast: insertCard.contrast || 100,
      saturation: insertCard.saturation || 100,
      gradientAngle: insertCard.gradientAngle || 135,
      createdAt: now,
      updatedAt: now,
    };
    this.cards.set(id, card);
    return card;
  }

  async updateCard(id: number, updates: Partial<InsertCard>): Promise<Card | undefined> {
    const card = this.cards.get(id);
    if (!card) return undefined;

    const updatedCard: Card = {
      ...card,
      ...updates,
      id: card.id,
      createdAt: card.createdAt,
      updatedAt: new Date(),
    };
    this.cards.set(id, updatedCard);
    return updatedCard;
  }

  async deleteCard(id: number): Promise<boolean> {
    return this.cards.delete(id);
  }

  async getTemplate(id: number): Promise<Template | undefined> {
    return this.templates.get(id);
  }

  async getAllTemplates(): Promise<Template[]> {
    return Array.from(this.templates.values());
  }

  async createTemplate(insertTemplate: InsertTemplate): Promise<Template> {
    const id = this.currentTemplateId++;
    const now = new Date();
    const template: Template = {
      id,
      name: insertTemplate.name,
      category: insertTemplate.category,
      description: insertTemplate.description,
      tags: insertTemplate.tags || [],
      preview: insertTemplate.preview,
      author: insertTemplate.author,
      downloads: insertTemplate.downloads || 0,
      rating: insertTemplate.rating || 0,
      isPremium: insertTemplate.isPremium || false,
      cardData: insertTemplate.cardData,
      createdAt: now,
      updatedAt: now,
    };
    this.templates.set(id, template);
    return template;
  }

  async updateTemplate(id: number, updates: Partial<InsertTemplate>): Promise<Template | undefined> {
    const template = this.templates.get(id);
    if (!template) return undefined;

    const updatedTemplate: Template = {
      ...template,
      ...updates,
      updatedAt: new Date(),
    };
    this.templates.set(id, updatedTemplate);
    return updatedTemplate;
  }

  async deleteTemplate(id: number): Promise<boolean> {
    return this.templates.delete(id);
  }

  async getPresentation(id: number): Promise<Presentation | undefined> {
    return this.presentations.get(id);
  }

  async getAllPresentations(): Promise<Presentation[]> {
    return Array.from(this.presentations.values());
  }

  async createPresentation(insertPresentation: InsertPresentation): Promise<Presentation> {
    const id = this.currentPresentationId++;
    const now = new Date();
    const presentation: Presentation = {
      id,
      title: insertPresentation.title || "Untitled Presentation",
      description: insertPresentation.description || null,
      content: insertPresentation.content || {},
      isStarred: insertPresentation.isStarred || false,
      collaborators: insertPresentation.collaborators || [],
      createdAt: now,
      updatedAt: now,
    };
    this.presentations.set(id, presentation);
    return presentation;
  }

  async updatePresentation(id: number, updates: Partial<InsertPresentation>): Promise<Presentation | undefined> {
    const presentation = this.presentations.get(id);
    if (!presentation) return undefined;

    const updatedPresentation: Presentation = {
      ...presentation,
      ...updates,
      updatedAt: new Date(),
    };
    this.presentations.set(id, updatedPresentation);
    return updatedPresentation;
  }

  async deletePresentation(id: number): Promise<boolean> {
    return this.presentations.delete(id);
  }

  async getSlide(id: number): Promise<Slide | undefined> {
    return this.slides.get(id);
  }

  async getSlidesByPresentation(presentationId: number): Promise<Slide[]> {
    return Array.from(this.slides.values())
      .filter(slide => slide.presentationId === presentationId)
      .sort((a, b) => a.position - b.position);
  }

  async createSlide(insertSlide: InsertSlide): Promise<Slide> {
    const id = this.currentSlideId++;
    const now = new Date();
    const slide: Slide = {
      id,
      presentationId: insertSlide.presentationId,
      title: insertSlide.title || "Untitled Slide",
      content: insertSlide.content || {},
      position: insertSlide.position || 0,
      isVisible: insertSlide.isVisible ?? true,
      createdAt: now,
      updatedAt: now,
    };
    this.slides.set(id, slide);
    return slide;
  }

  async updateSlide(id: number, updates: Partial<InsertSlide>): Promise<Slide | undefined> {
    const slide = this.slides.get(id);
    if (!slide) return undefined;

    const updatedSlide: Slide = {
      ...slide,
      ...updates,
      updatedAt: new Date(),
    };
    this.slides.set(id, updatedSlide);
    return updatedSlide;
  }

  async deleteSlide(id: number): Promise<boolean> {
    return this.slides.delete(id);
  }
}

export const storage = new MemStorage();
