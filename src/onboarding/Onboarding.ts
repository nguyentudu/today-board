import type { Language } from "../ui/i18n";
import type { FirstReturnInput, FirstReturnState } from "./firstReturn";
import { writeFirstReturnState } from "./firstReturn";

interface OnboardingProps {
  language: Language;
  hasCards: boolean;
  state: FirstReturnState;
  onCreate: (input: FirstReturnInput) => boolean;
}

const onboardingCopy = {
  vi: {
    eyebrow: "Bắt đầu trong khoảng một phút",
    title: "Có việc gì bạn sẽ phải quay lại sau này?",
    helper: "Chỉ lưu tên tình huống và điểm quay lại. Các trường sâu hơn có thể bổ sung khi cần.",
    situation: "Tình huống",
    situationPlaceholder: "Ví dụ: Hoàn thiện bản đề xuất cho khách hàng",
    returnPoint: "Khi quay lại, bắt đầu từ đâu?",
    returnPointPlaceholder: "Ví dụ: Mở phần ngân sách và kiểm tra ba giả định",
    sample: "Điền ví dụ",
    create: "Lưu điểm quay lại đầu tiên",
    skip: "Để sau",
    required: "Hãy nhập cả tình huống và điểm quay lại.",
    saveFailed: "Chưa thể lưu. Board vẫn an toàn; hãy kiểm tra dung lượng trình duyệt.",
    successTitle: "Điểm quay lại đã sẵn sàng",
    successCopy: "Bạn có thể đóng Moon. Khi trở lại, card bên dưới sẽ giữ đúng nơi để bắt đầu.",
    done: "Đã hiểu",
    sampleTitle: "Chuẩn bị buổi trao đổi với khách hàng",
    sampleReturn: "Mở ghi chú phản hồi và bắt đầu từ câu hỏi chưa được trả lời.",
  },
  en: {
    eyebrow: "Start in about one minute",
    title: "What will you need to return to later?",
    helper: "Save only the situation and return point. Deeper fields stay available when you need them.",
    situation: "Situation",
    situationPlaceholder: "Example: Finish the client proposal",
    returnPoint: "When you return, where should you start?",
    returnPointPlaceholder: "Example: Open the budget section and check the three assumptions",
    sample: "Use an example",
    create: "Save my first return point",
    skip: "Do this later",
    required: "Enter both the situation and the return point.",
    saveFailed: "Could not save yet. Your board is still safe; check browser storage capacity.",
    successTitle: "Your return point is ready",
    successCopy: "You can close Moon. When you return, the card below will keep the exact place to begin.",
    done: "Got it",
    sampleTitle: "Prepare for the client conversation",
    sampleReturn: "Open the feedback notes and start with the unanswered question.",
  },
} as const;

export function Onboarding({ language, hasCards, state, onCreate }: OnboardingProps): HTMLElement | null {
  if ((hasCards && state.stage === "new") || state.stage === "dismissed") {
    return null;
  }

  const text = onboardingCopy[language];
  const panel = document.createElement("section");
  panel.className = "first-return-onboarding";
  panel.setAttribute("aria-labelledby", "first-return-title");

  if (state.stage === "created") {
    const title = document.createElement("h2");
    title.id = "first-return-title";
    title.textContent = text.successTitle;
    const copy = document.createElement("p");
    copy.textContent = text.successCopy;
    const done = document.createElement("button");
    done.type = "button";
    done.className = "quiet-button";
    done.textContent = text.done;
    done.addEventListener("click", () => {
      writeFirstReturnState({ stage: "dismissed", cardId: state.cardId });
      panel.remove();
    });
    panel.append(title, copy, done);
    return panel;
  }

  const eyebrow = document.createElement("p");
  eyebrow.className = "onboarding-eyebrow";
  eyebrow.textContent = text.eyebrow;
  const title = document.createElement("h2");
  title.id = "first-return-title";
  title.textContent = text.title;
  const helper = document.createElement("p");
  helper.className = "onboarding-helper";
  helper.textContent = text.helper;

  const form = document.createElement("form");
  form.className = "first-return-form";
  const situation = createField(text.situation, text.situationPlaceholder);
  const returnPoint = createField(text.returnPoint, text.returnPointPlaceholder);
  const status = document.createElement("p");
  status.className = "onboarding-status";
  status.setAttribute("role", "status");

  const actions = document.createElement("div");
  actions.className = "onboarding-actions";
  const sample = document.createElement("button");
  sample.type = "button";
  sample.className = "quiet-button";
  sample.textContent = text.sample;
  sample.addEventListener("click", () => {
    situation.input.value = text.sampleTitle;
    returnPoint.input.value = text.sampleReturn;
    situation.input.focus();
  });
  const submit = document.createElement("button");
  submit.type = "submit";
  submit.textContent = text.create;
  const skip = document.createElement("button");
  skip.type = "button";
  skip.className = "quiet-button";
  skip.textContent = text.skip;
  skip.addEventListener("click", () => {
    writeFirstReturnState({ stage: "dismissed" });
    panel.remove();
  });
  actions.append(sample, submit, skip);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!situation.input.value.trim() || !returnPoint.input.value.trim()) {
      status.textContent = text.required;
      return;
    }
    const saved = onCreate({ title: situation.input.value, returnPoint: returnPoint.input.value });
    if (!saved) {
      status.textContent = text.saveFailed;
    }
  });

  form.append(situation.label, returnPoint.label, status, actions);
  panel.append(eyebrow, title, helper, form);
  return panel;
}

function createField(labelText: string, placeholder: string): { label: HTMLLabelElement; input: HTMLInputElement } {
  const label = document.createElement("label");
  label.className = "onboarding-field";
  const text = document.createElement("span");
  text.textContent = labelText;
  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = placeholder;
  input.maxLength = 360;
  input.required = true;
  label.append(text, input);
  return { label, input };
}
