import { html } from 'htm/preact';
import { render } from "preact"
import { useEffect, useRef, useState } from "preact/compat"


function getCsrfToken() {
  const token = document.querySelector('meta[name="csrf-token"]').content;
  if (!token) {
    throw new Error("CSRF token not found");
  }
  return token;
}

function getBaseUrl() {
  const match = /.*\/merge_requests\/[0-9]+/.exec(location.pathname);
  if (match === null) {
    throw Error("Could not find URL for current merge request");
  }
  return match[0];
}

function Modal({ title, children, onClose }) {
  const modalContainerRef = useRef();

  function handleClickModalContainer(evt) {
    if (evt.target === modalContainerRef.current) {
      onClose();
    }
  }

  const [modalClass, setModalClass] = useState("");
  useEffect(() => {
    setModalClass("show");
  }, []);

  return html`
    <div style="position: absolute; z-index: 1040">
      <div
        role="dialog"
        class=${`modal gl-modal fade ${modalClass}`}
        style="display: block"
        aria-modal="true"
        ref=${modalContainerRef}
        onClick=${handleClickModalContainer}
      >
        <div class="modal-dialog modal-lg">
          <span tabindex="0"></span>
          <div tabindex="-1" class="modal-content">
            <header class="modal-header">
              <h4 class="modal-title">${title}</h4>
              <button
                aria-label="Close"
                type="button"
                class="btn btn-default btn-sm gl-button btn-default-tertiary btn-icon"
                onClick=${onClose}
              >
                <svg
                  data-testid="close-icon"
                  role="img"
                  aria-hidden="true"
                  class="gl-button-icon gl-icon s16"
                >
                  <use
                    href="/assets/icons-7f1680a3670112fe4c8ef57b9dfb93f0f61b43a2a479d7abd6c83bcb724b9201.svg#close"
                  ></use>
                </svg>
              </button>
            </header>
            <div
              class="modal-body"
              style=${{ maxHeight: "80vh", overflowY: "scroll" }}
            >
              ${children}
            </div>
            <footer class="modal-footer gl-bg-gray-10 gl-p-5">
              <button
                type="button"
                class="btn btn-default gl-button"
                onClick=${onClose}
              >
                Close
              </button>
            </footer>
          </div>
          <span tabindex="0"></span>
        </div>
      </div>
      <div class="modal-backdrop"></div>
    </div>
  `;
}

function Draft({ data, onDelete, onPublish }) {
  function handleDelete() {
    if (confirm("Do you really want to delete this comment?")) {
      onDelete();
    }
  }

  const contentRef = useRef();

  useEffect(() => {
    // Fix lazy images never loading
    contentRef.current.querySelectorAll("[data-src]").forEach((lazyElem) => {
      lazyElem.src = lazyElem.dataset.src;
    });
  }, [data.note_html]);

  return html`
    <article class="draft-note-component note-wrapper border rounded my-4">
      <div
        class="md mb-3"
        ref=${contentRef}
        dangerouslySetInnerHTML=${{ __html: data.note_html }}
      ></div>
      <div class="d-flex">
        <button
          type="button"
          class="btn btn-danger btn-md gl-button btn-danger-secondary"
          onClick=${handleDelete}
        >
          Delete comment
        </button>
        <button
          type="button"
          class="btn gl-ml-3 btn-default btn-md gl-button"
          onClick=${() => onPublish()}
        >
          Add comment now
        </button>
      </div>
    </article>
  `;
}

function DraftModal() {
  const [isOpen, setIsOpen] = useState(true);
  const [drafts, setDrafts] = useState({
    data: [],
    error: null,
    loading: true,
  });

  if (!isOpen) {
    return null;
  }

  useEffect(async () => {
    try {
      const response = await fetch(`${getBaseUrl()}/drafts`);
      const data = await response.json();
      setDrafts({ ...drafts, data, loading: false });
    } catch (error) {
      console.error(error);
      setDrafts((state) => ({ ...drafts, loading: false, error }));
    }
  }, []);

  async function deleteDraft(draftId) {
    const response = await fetch(`${getBaseUrl()}/drafts/${draftId}`, {
      method: "DELETE",
      headers: {
        "X-CSRF-Token": getCsrfToken(),
      },
    });
    if (response.ok) {
      setDrafts(({ data, ...rest }) => ({
        ...rest,
        data: data.filter((d) => d.id !== draftId),
      }));
    }
  }

  async function publishDraft(draftId) {
    const response = await fetch(`${getBaseUrl()}/drafts/publish`, {
      method: "POST",
      body: JSON.stringify({ id: draftId }),
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": getCsrfToken(),
      },
    });
    if (response.ok) {
      setDrafts(({ data, ...rest }) => ({
        ...rest,
        data: data.filter((d) => d.id !== draftId),
      }));
    }
  }

  return html`
    <${Modal} title="Draft comments" onClose=${() => setIsOpen(false)}>
      ${drafts.loading
        ? html`<em>Loading...</em>`
        : drafts.error
        ? html`<strong>Error</strong>
            <div>${String(drafts.error)}</div>`
        : drafts.data.length === 0
        ? html`<em>No draft comments</em>`
        : drafts.data.map(
            (draft) =>
              html`<${Draft}
                data=${draft}
                onDelete=${() => deleteDraft(draft.id)}
                onPublish=${() => publishDraft(draft.id)}
              />`
          )}
    <//>
  `;
}

export default function main() {
  const container = document.createElement("div");
  document.body.appendChild(container);
  render(html`<${DraftModal} />`, container);
}

globalThis.gitlabViewDrafts = main;
