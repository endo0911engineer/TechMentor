export const JOB_TITLES = [
  "バックエンドエンジニア",
  "フロントエンドエンジニア",
  "フルスタックエンジニア",
  "モバイルエンジニア（iOS）",
  "モバイルエンジニア（Android）",
  "インフラ / SREエンジニア",
  "データエンジニア",
  "機械学習 / AIエンジニア",
  "セキュリティエンジニア",
  "QAエンジニア",
  "プロダクトマネージャー",
  "エンジニアリングマネージャー",
  "その他",
] as const;

export const EXPERIENCE_OPTIONS = [
  { label : "新卒・未経験", value: 0 },
  { label: "1年未満", value: 0 },
  { label: "1年", value: 1 },
  { label: "2年", value: 2 },
  { label: "3年", value: 3 },
  { label: "4年", value: 4 },
  { label: "5年", value: 5 },
  { label: "6年", value: 6 },
  { label: "7年", value: 7 },
  { label: "8年", value: 8 },
  { label: "9年", value: 9 },
  { label: "10年", value: 10 },
  { label: "12年", value: 12 },
  { label: "15年", value: 15 },
  { label: "20年以上", value: 20 },
] as const;

export const REMOTE_OPTIONS = [
  "フルリモート",
  "一部リモート（週3日以上）",
  "一部リモート（週1〜2日）",
  "出社のみ",
] as const;

export const OVERTIME_OPTIONS = [
  "ほぼなし（月10時間未満）",
  "少ない（月10〜20時間）",
  "普通（月20〜40時間）",
  "多い（月40〜60時間）",
  "非常に多い（月60時間以上）",
] as const;

export const LOCATION_OPTIONS = [
  "東京",
  "神奈川",
  "大阪",
  "愛知",
  "福岡",
  "北海道",
  "宮城",
  "広島",
  "その他",
] as const;

export const RESULT_OPTIONS = ["合格", "不合格", "辞退", "選考中"] as const;

export const DIFFICULTY_OPTIONS = [
  "とても簡単",
  "簡単",
  "普通",
  "難しい",
  "とても難しい",
] as const;

export const TECH_STACK_OPTIONS = [
  // 言語
  "TypeScript", "JavaScript", "Python", "Go", "Java", "Kotlin", "Swift",
  "Ruby", "Rust", "C#", "C++", "PHP", "Scala",
  // フロントエンド
  "React", "Next.js", "Vue.js", "Nuxt.js", "Angular",
  // バックエンド
  "Node.js", "FastAPI", "Django", "Ruby on Rails", "Spring Boot", "Laravel",
  // インフラ / クラウド
  "AWS", "GCP", "Azure", "Docker", "Kubernetes", "Terraform",
  // DB
  "PostgreSQL", "MySQL", "MongoDB", "Redis",
] as const;

export const INTERVIEW_CONTENT_KEYS = [
  { key: "coding", label: "コーディング試験" },
  { key: "system_design", label: "システムデザイン" },
  { key: "behavioral", label: "行動面接（Behavioral）" },
  { key: "case", label: "ケース面接" },
  { key: "english", label: "英語面接" },
  { key: "other", label: "その他" },
] as const;

export type InterviewContentKey = typeof INTERVIEW_CONTENT_KEYS[number]["key"];
