import {
  useRef,
  html,
  useEffect,
  useState,
  render,
} from "https://cdn.jsdelivr.net/npm/htm@3.1.1/preact/standalone.module.js";

console.log("coucou start");

function getCsrfToken() {
  const token = document.querySelector('meta[name="csrf-token"]').content;
  if (!token) {
    throw new Error("CSRF token not found");
  }
  return token;
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

function Draft({ data, onDelete }) {
  function handleDelete() {
    if (confirm("Do you really want to delete this comment?")) {
      onDelete();
    }
  }

  return html`
    <article class="draft-note-component note-wrapper border rounded my-4">
      <!-- TODO: fix lazy images -->
      <div
        class="md mb-3"
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
        <button type="button" class="btn gl-ml-3 btn-default btn-md gl-button">
          Add comment now
        </button>
      </div>
    </article>
  `;
}

function DraftModal() {
  const [isOpen, setIsOpen] = useState(true);
  const [drafts, setDrafts] = useState(null);

  if (!isOpen) {
    return null;
  }

  useEffect(() => {
    // TODO: use dynamic URL
    fetch("/simonbru/mess/-/merge_requests/1/drafts")
      // TODO: error handling
      .then((res) => res.json())
      .then((res) => (console.log(res), res))
      .then((data) => setDrafts(data));
  }, []);

  async function deleteDraft(draftId) {
    await fetch(`/simonbru/mess/-/merge_requests/1/drafts/${draftId}`, {
      method: "DELETE",
      headers: {
        "X-CSRF-Token": getCsrfToken(),
      },
    });
    // TODO: check response status
    setDrafts(drafts.filter((d) => d.id !== draftId));
  }

  return html`
    <${Modal} title="Draft comments" onClose=${() => setIsOpen(false)}>
      ${drafts === null
        ? html`<em>Loading...</em>`
        : drafts.map(
            (draft) =>
              html`<${Draft}
                data=${draft}
                onDelete=${() => deleteDraft(draft.id)}
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

console.log("coucou end");
