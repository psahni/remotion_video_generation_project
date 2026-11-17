export type StoryScene = {
  title: string;
  audioFile: string;
  lines: string[];
};

export const storyboard: Record<string, StoryScene> = {
  hook: {
    title: 'Claude ko baar-baar samjhana padta hai?',
    audioFile: '01-hook.wav',
    lines: [
      'Socho, aapne ek naya assistant hire kiya.',
      "Aur har roz subah, aapko usko same instructions repeat karni padti hain: 'Ye file mat chhedo, tests aise run karo, 2 spaces use karo.'",
      'Kitna annoying hai na?',
      'Claude Code ke saath bhi exactly yahi hota hai.',
      'Har naye chat mein aapko same baatein repeat karni padti hain... jab tak aap uski Memory set up nahi karte.',
      'Aaj main aapko dikhata hoon ki Claude ki memory kaise kaam karti hai.',
    ],
  },
  'two-memories': {
    title: 'Memory ke do types',
    audioFile: '02-two-memories.wav',
    lines: [
      'Claude Code mein memory basically do tarah ki hoti hai.',
      'Pehli hai CLAUDE.md.',
      'Ye wo memory hai jo aap likhte ho.',
      'Ye ek project handbook ya rule book hai.',
      'Dusri hai Auto Memory.',
      'Ye wo notes hain jo Claude khud banata hai jab wo aapke saath kaam karte-kaarte seekhta hai.',
      'Dono mil kar Claude ko smart banate hain.',
    ],
  },
  'claude-md': {
    title: 'CLAUDE.md: aapki project rule book',
    audioFile: '03-claude-md.wav',
    lines: [
      'Chaliye pehle CLAUDE.md ko samajhte hain.',
      'Isme aap wo saare project rules likhte ho jo Claude ko har session mein yaad rehne chahiye.',
      "Jaise: 'Hamesha functional components use karo', 'Database queries hamesha service layer se hi karo', ya phir 'UI mein hardcoded colors mat likho, theme variables use karo'.",
      'Ab aapko har naye chat mein ye cheezein repeat nahi karni padengi, kyunki Claude is file ko shuru mein padh leta hai.',
      'Ek Pro tip: Ise short rakho!',
      'Claude recommend karta hai, 150-200 lines se zyada Claude.md file nahi honi chaiye, warna Claude distract ho jayega.',
    ],
  },
  'personal-rules': {
    title: 'Personal aur team ke rules',
    audioFile: '04-personal-rules.wav',
    lines: [
      'Ab agar aapka project bahut bada hai, toh saare rules ek hi CLAUDE.md mein mat daalo.',
      'Aap ek rules directory bana sakte ho .claude folder ke ander.',
      'Isme alag-alag topic ke hisaab se files rakh sakte ho, jaise testing.md testing conventions ke liye, ya database.md.',
      'Claude Code in rules ko automatically pick up kar leta hai.',
      'Aur ek special file hoti hai: CLAUDE.local.md.',
      'Ye aapke personal preferences aur secrets ke liye hai.',
      'Aap ye file .gitignore mein daal dete ho, taaki aapki team ko ye personal cheezein na dikhein.',
      'Ye sirf aapke aur Claude ke beech ki baat hai.',
    ],
  },
  'auto-memory': {
    title: 'Auto Memory: seekh jo chats ke paar jaaye',
    audioFile: '05-auto-memory.wav',
    lines: [
      'Ab aate hain Auto Memory par.',
      'Maan lo aapne Feature 1 pe kaam kiya, phir naya chat khola Feature 2 ke liye.',
      'Toh kya Claude ko purani chat yaad hai? Nahi.',
      'Har chat fresh start hoti hai.',
      'Lekin! Claude ke paas apni ek hidden memory hoti hai jo aapke computer mein save hoti hai.',
      'Auto memory by default ON hoti hai.',
      'Jab aap Feature 1 mein Claude ko correct karte ho, toh wo us learning ko apni memory mein note kar leta hai, taaki Feature 2 wale chat mein wo galti na kare.',
      'Aur agar aap dekhna chahte ho ki Claude ne kya yaad rakha hai, toh chat mein type karo: /memory.',
    ],
  },
  'golden-rule': {
    title: 'Golden rule',
    audioFile: '06-golden-rule.wav',
    lines: [
      'Toh simple rule kya hai?',
      'Agar koi instruction aapko Claude ko baar-baar dena pad raha hai, toh use explicitly bol kar memory mein save karwa lo.',
      "Claude ko bol sakte ho: 'Please remember this for future chats.'",
      'Ye zyada reliable hai.',
      'Aur yaad rakho, har random cheez memory mein mat bharo—sirf important project learnings hi save karo.',
    ],
  },
  outro: {
    title: 'Part 2: sub-agent memory',
    audioFile: '07-teaser-outro.wav',
    lines: [
      'Aur ek interesting cheez: Claude mein aap sub-agents bana sakte ho, jaise ek Code Reviewer.',
      'Unki bhi apni alag memory hoti hai!',
      'Wo kaise kaam karti hai, ye hum Part 2 mein cover karenge.',
      'Tab tak ke liye, apne CLAUDE.md files ko short rakho, aur /memory command use karna mat bhoolo.',
      'Video pasand aayi ho toh share karo, aur follow karo for more AI coding tips!',
    ],
  },
};
