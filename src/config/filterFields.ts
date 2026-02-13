import { FieldType } from "../types/filter";
import type { FieldDefinition } from "../types/filter";

export const DEPARTMENT_OPTIONS = [
    { label: "Engineering", value: "Engineering" },
    { label: "Marketing", value: "Marketing" },
    { label: "Sales", value: "Sales" },
    { label: "Human Resources", value: "Human Resources" },
    { label: "Finance", value: "Finance" },
    { label: "Design", value: "Design" },
    { label: "Product", value: "Product" },
    { label: "Operations", value: "Operations" },
];

export const ROLE_OPTIONS = [
    { label: "Senior Developer", value: "Senior Developer" },
    { label: "Junior Developer", value: "Junior Developer" },
    { label: "Lead Developer", value: "Lead Developer" },
    { label: "Marketing Manager", value: "Marketing Manager" },
    { label: "Sales Representative", value: "Sales Representative" },
    { label: "HR Specialist", value: "HR Specialist" },
    { label: "Financial Analyst", value: "Financial Analyst" },
    { label: "UX Designer", value: "UX Designer" },
    { label: "Product Manager", value: "Product Manager" },
    { label: "DevOps Engineer", value: "DevOps Engineer" },
    { label: "Data Scientist", value: "Data Scientist" },
    { label: "QA Engineer", value: "QA Engineer" },
    { label: "Operations Manager", value: "Operations Manager" },
    { label: "Content Strategist", value: "Content Strategist" },
    { label: "Account Executive", value: "Account Executive" },
];

export const SKILL_OPTIONS = [
    { label: "React", value: "React" },
    { label: "TypeScript", value: "TypeScript" },
    { label: "Node.js", value: "Node.js" },
    { label: "GraphQL", value: "GraphQL" },
    { label: "Python", value: "Python" },
    { label: "Java", value: "Java" },
    { label: "AWS", value: "AWS" },
    { label: "Docker", value: "Docker" },
    { label: "Kubernetes", value: "Kubernetes" },
    { label: "SQL", value: "SQL" },
    { label: "MongoDB", value: "MongoDB" },
    { label: "Figma", value: "Figma" },
    { label: "Photoshop", value: "Photoshop" },
    { label: "Salesforce", value: "Salesforce" },
    { label: "Excel", value: "Excel" },
    { label: "Tableau", value: "Tableau" },
    { label: "Go", value: "Go" },
    { label: "Rust", value: "Rust" },
    { label: "Vue.js", value: "Vue.js" },
    { label: "Angular", value: "Angular" },
];

export const COUNTRY_OPTIONS = [
    { label: "USA", value: "USA" },
    { label: "Canada", value: "Canada" },
    { label: "UK", value: "UK" },
    { label: "Germany", value: "Germany" },
    { label: "India", value: "India" },
    { label: "Australia", value: "Australia" },
    { label: "Japan", value: "Japan" },
];

export const FILTER_FIELDS: FieldDefinition[] = [
    { key: "name", label: "Name", type: FieldType.Text },
    { key: "email", label: "Email", type: FieldType.Text },
    {
        key: "department",
        label: "Department",
        type: FieldType.SingleSelect,
        options: DEPARTMENT_OPTIONS,
    },
    {
        key: "role",
        label: "Role",
        type: FieldType.SingleSelect,
        options: ROLE_OPTIONS,
    },
    { key: "salary", label: "Salary", type: FieldType.Amount },
    { key: "joinDate", label: "Join Date", type: FieldType.Date },
    { key: "isActive", label: "Is Active", type: FieldType.Boolean },
    {
        key: "skills",
        label: "Skills",
        type: FieldType.MultiSelect,
        options: SKILL_OPTIONS,
    },
    {
        key: "address.city",
        label: "City",
        type: FieldType.Text,
        nested: true,
    },
    {
        key: "address.state",
        label: "State",
        type: FieldType.Text,
        nested: true,
    },
    {
        key: "address.country",
        label: "Country",
        type: FieldType.SingleSelect,
        options: COUNTRY_OPTIONS,
        nested: true,
    },
    { key: "projects", label: "Projects", type: FieldType.Number },
    { key: "lastReview", label: "Last Review", type: FieldType.Date },
    {
        key: "performanceRating",
        label: "Performance Rating",
        type: FieldType.Number,
    },
];
