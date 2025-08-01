import { ButtonProps } from 'ant-design-vue';
import useMergedState from '../_util/hooks/useMergedState';
import { computed, ref, watchEffect, type MaybeRefOrGetter, toValue, onWatcherCleanup, type ComputedRef, type Ref } from 'vue';

// Ensure that the SpeechRecognition API is available in the browser
let SpeechRecognition: any;

if (!SpeechRecognition && typeof window !== 'undefined') {
  SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
}

export type ControlledSpeechConfig = {
  recording?: boolean;
  onRecordingChange?: (recording: boolean) => void;
  audioIcon?: ButtonProps['icon'];
  audioDisabledIcon?: ButtonProps['icon']
  audioRecordingIcon?: ButtonProps['icon'];
};

export type AllowSpeech = boolean | ControlledSpeechConfig;

export type UseSpeechReturn = {
  speechPermission: ComputedRef<boolean>;
  triggerSpeech: (forceBreak: boolean) => void;
  recording: Ref<boolean>;
}

export default function useSpeech(
  onSpeech: (transcript: string) => void,
  allowSpeech?: MaybeRefOrGetter<AllowSpeech>,
): UseSpeechReturn {
  const onEventSpeech = onSpeech;

  // ========================== Speech Config ==========================
  const allowSpeechItem =
    computed(() => {
      const allowSpeechRaw = toValue(allowSpeech);
      if (typeof allowSpeechRaw === 'object') {
        return {
          controlledRecording: allowSpeechRaw.recording,
          onControlledRecordingChange: allowSpeechRaw.onRecordingChange,
          speechInControlled: typeof allowSpeechRaw.recording === 'boolean',
        } as const;
      }

      return {
        controlledRecording: undefined,
        onControlledRecordingChange: undefined,
        speechInControlled: false,
      }
    });

  const controlledRecording = computed(() => allowSpeechItem.value.controlledRecording)
  const onControlledRecordingChange = allowSpeechItem.value.onControlledRecordingChange
  const speechInControlled = allowSpeechItem.value.speechInControlled

  // ======================== Speech Permission ========================
  const permissionState = ref<PermissionState | null>(null);

  watchEffect(() => {
    if (typeof navigator !== 'undefined' && 'permissions' in navigator) {
      let lastPermission: PermissionStatus | null = null;

      (navigator as any).permissions
        .query({ name: 'microphone' })
        .then((permissionStatus: PermissionStatus) => {
          permissionState.value = permissionStatus.state;

          // Keep the last permission status.
          permissionStatus.onchange = function () {
            permissionState.value = this.state;
          };

          lastPermission = permissionStatus;
        });

      onWatcherCleanup(() => {
        // Avoid memory leaks
        if (lastPermission) {
          lastPermission.onchange = null;
        }
      });
    }
  });

  // Convert permission state to a simple type
  const mergedAllowSpeech = computed(() => SpeechRecognition && permissionState.value !== 'denied');

  // ========================== Speech Events ==========================
  const recognitionRef = ref<any | null>(null);
  const [recording, setRecording] = useMergedState(false, {
    value: controlledRecording,
  });

  const forceBreakRef = ref(false);

  const ensureRecognition = () => {
    if (mergedAllowSpeech.value && !recognitionRef.value) {
      const recognition = new SpeechRecognition();

      recognition.onstart = () => {
        setRecording(true);
      };

      recognition.onend = () => {
        setRecording(false);
      };

      recognition.onresult = (event: SpeechRecognitionResult) => {
        if (!forceBreakRef.value) {
          const transcript = (event as any).results?.[0]?.[0]?.transcript;
          onEventSpeech(transcript);
        }

        forceBreakRef.value = false;
      };

      recognitionRef.value = recognition;
    }
  };

  const triggerSpeech = (forceBreak: boolean) => {
    // Ignore if `forceBreak` but is not recording
    if (forceBreak && !recording.value) {
      return;
    }

    forceBreakRef.value = forceBreak;

    if (speechInControlled) {
      // If in controlled mode, do nothing
      onControlledRecordingChange?.(!recording.value);
    } else {
      ensureRecognition();

      if (recognitionRef.value) {
        if (recording.value) {
          recognitionRef.value.stop();
          onControlledRecordingChange?.(false);
        } else {
          recognitionRef.value.start();
          onControlledRecordingChange?.(true);
        }
      }
    }
  };

  return { speechPermission: mergedAllowSpeech, triggerSpeech, recording }
}
