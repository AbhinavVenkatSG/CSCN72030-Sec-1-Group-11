import { useCallback, useEffect, useRef, useState } from "react";

const clamp = (n: number, min = 0, max = 100) => Math.max(min, Math.min(max, n));

export type foodStatus = "Full" | "Low" | "Ok";

