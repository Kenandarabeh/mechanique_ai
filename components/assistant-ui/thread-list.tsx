import type { FC } from "react";
import {
  ThreadListItemPrimitive,
  ThreadListPrimitive,
  useAssistantState,
} from "@assistant-ui/react";
import { ArchiveIcon, PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TooltipIconButton } from "@/components/assistant-ui/tooltip-icon-button";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "@/lib/i18n";

export const ThreadList: FC = () => {
  return (
    <ThreadListPrimitive.Root className="aui-root aui-thread-list-root flex flex-col items-stretch gap-1.5">
      <ThreadListNew />
      <ThreadListItems />
    </ThreadListPrimitive.Root>
  );
};

const ThreadListNew: FC = () => {
  const { t } = useTranslation();
  return (
    <ThreadListPrimitive.New asChild>
      <Button
        className="aui-thread-list-new flex items-center justify-start gap-1 rounded-lg px-2.5 py-2 text-start hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-100 data-active:bg-gray-200 dark:data-active:bg-gray-700 transition-colors"
        variant="ghost"
      >
        <PlusIcon />
        {t('sidebar.newChat')}
      </Button>
    </ThreadListPrimitive.New>
  );
};

const ThreadListItems: FC = () => {
  const isLoading = useAssistantState(({ threads }) => threads.isLoading);

  if (isLoading) {
    return <ThreadListSkeleton />;
  }

  return <ThreadListPrimitive.Items components={{ ThreadListItem }} />;
};

const ThreadListSkeleton: FC = () => {
  const { t } = useTranslation();
  return (
    <>
      {Array.from({ length: 5 }, (_, i) => (
        <div
          key={i}
          role="status"
          aria-label={t('sidebar.loadingThreads')}
          aria-live="polite"
          className="aui-thread-list-skeleton-wrapper flex items-center gap-2 rounded-md px-3 py-2"
        >
          <Skeleton className="aui-thread-list-skeleton h-[22px] flex-grow" />
        </div>
      ))}
    </>
  );
};

const ThreadListItem: FC = () => {
  return (
    <ThreadListItemPrimitive.Root className="aui-thread-list-item flex items-center gap-2 rounded-lg transition-all hover:bg-gray-100 dark:hover:bg-gray-800 focus-visible:bg-gray-200 dark:focus-visible:bg-gray-700 focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:outline-none data-active:bg-gray-200 dark:data-active:bg-gray-700">
      <ThreadListItemPrimitive.Trigger className="aui-thread-list-item-trigger flex-grow px-3 py-2 text-start">
        <ThreadListItemTitle />
      </ThreadListItemPrimitive.Trigger>
      <ThreadListItemArchive />
    </ThreadListItemPrimitive.Root>
  );
};

const ThreadListItemTitle: FC = () => {
  const { t } = useTranslation();
  return (
    <span className="aui-thread-list-item-title text-sm text-gray-800 dark:text-gray-200">
      <ThreadListItemPrimitive.Title fallback={t('sidebar.newChat')} />
    </span>
  );
};

const ThreadListItemArchive: FC = () => {
  const { t } = useTranslation();
  return (
    <ThreadListItemPrimitive.Archive asChild>
      <TooltipIconButton
        className="aui-thread-list-item-archive mr-3 ml-auto size-4 p-0 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
        variant="ghost"
        tooltip={t('sidebar.archiveThread')}
      >
        <ArchiveIcon />
      </TooltipIconButton>
    </ThreadListItemPrimitive.Archive>
  );
};
