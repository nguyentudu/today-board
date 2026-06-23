import type { BoardState } from "../domain/state";

export type Language = "vi" | "en";

export const copy = {
  en: {
    title: "Moon Today Board",
    subtitle: "Help me return without rebuilding my world.",
    createPlaceholder: "Name something to hold",
    createButton: "Create card",
    exportButton: "Export JSON",
    importButton: "Import board",
    selectedFile: "Selected:",
    savedNote: "Saved locally for continuity. No tracking.",
    changeZone: "Change zone",
    hideCard: "Hide card",
    cardName: "Card name",
    tinyNote: "Tiny note",
    whyStillOpen: "Why is this still open?",
    ifYouReturn: "If I return, start here",
    created: "Created",
    lastTouched: "Last touched",
    currentState: "Current state",
    testNotesTitle: "Test Notes",
    testNotes: ["Use this quietly.", "You can ignore everything here.", "No correct way to use this."],
    stateLabels: {
      continue: "Continue",
      pause: "Pause",
      finished: "Finished",
      "leave-alone": "Leave Alone",
    },
    stateCopy: {
      continue: "Available when you want to return.",
      pause: "Paused is valid.",
      finished: "Remove from active load.",
      "leave-alone": "Do not reopen unless chosen.",
    },
    emptyCopy: {
      continue: "Nothing needs to return right now.",
      pause: "Nothing is waiting here.",
      finished: "Nothing to release.",
      "leave-alone": "Nothing protected here.",
    },
  },
  vi: {
    title: "Moon Today Board",
    subtitle: "Giúp tôi quay lại mà không phải dựng lại mọi thứ.",
    createPlaceholder: "Viết một điều cần giữ lại",
    createButton: "Tạo card",
    exportButton: "Xuất JSON",
    importButton: "Nhập board",
    selectedFile: "Selected:",
    savedNote: "Đã lưu trên máy này. Không theo dõi.",
    changeZone: "Đổi vùng",
    hideCard: "Ẩn card",
    cardName: "Tên card",
    tinyNote: "Ghi chú nhỏ",
    whyStillOpen: "Vì sao còn mở?",
    ifYouReturn: "Nếu quay lại, bắt đầu từ đâu?",
    created: "Đã tạo",
    lastTouched: "Lần cuối chạm",
    currentState: "Vùng hiện tại",
    testNotesTitle: "Test Notes",
    testNotes: ["Dùng thật nhẹ.", "Bạn có thể bỏ qua mọi thứ ở đây.", "Không có cách dùng đúng."],
    stateLabels: {
      continue: "Quay lại",
      pause: "Tạm dừng",
      finished: "Đã xong",
      "leave-alone": "Để yên",
    },
    stateCopy: {
      continue: "Có sẵn khi bạn muốn quay lại.",
      pause: "Tạm dừng là hợp lệ.",
      finished: "Gỡ khỏi tải đang mở.",
      "leave-alone": "Không mở lại trừ khi bạn chọn.",
    },
    emptyCopy: {
      continue: "Không có gì cần quay lại lúc này.",
      pause: "Không có gì đang chờ ở đây.",
      finished: "Không có gì cần gỡ ra.",
      "leave-alone": "Không có gì đang được giữ yên.",
    },
  },
} satisfies Record<
  Language,
  {
    title: string;
    subtitle: string;
    createPlaceholder: string;
    createButton: string;
    exportButton: string;
    importButton: string;
    selectedFile: string;
    savedNote: string;
    changeZone: string;
    hideCard: string;
    cardName: string;
    tinyNote: string;
    whyStillOpen: string;
    ifYouReturn: string;
    created: string;
    lastTouched: string;
    currentState: string;
    testNotesTitle: string;
    testNotes: string[];
    stateLabels: Record<BoardState, string>;
    stateCopy: Record<BoardState, string>;
    emptyCopy: Record<BoardState, string>;
  }
>;
