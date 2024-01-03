import styles from './components.module.css'
export default function Pagination({ currentPage, maxPage, onChangePage }) {
    const pagesToShow = () => {
        const pages = [];
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          if (i > 0 && i <= maxPage) pages.push(i);
        }
        return pages;
      };
    
      return (
        <div className={styles.pageContainer}>
          <button
            className={styles.pageButton}
            onClick={() => onChangePage(1)}
            aria-label="Go to first page"
          >
            &laquo;
          </button>
          {currentPage > 1 && (
            <button
              className={styles.pageButton}
              onClick={() => onChangePage(currentPage - 1)}
              aria-label="Go to previous page"
            >
              &lsaquo;
            </button>
          )}
          {pagesToShow().map((page) => (
            <button
              className={currentPage === page ? styles.activePaginationButton : styles.paginationButton}
              key={page}
              onClick={() => onChangePage(page)}
              aria-label={`Go to page ${page}`}
            >
              {page}
            </button>
          ))}
          {currentPage < maxPage && (
            <button
              className={styles.pageButton}
              onClick={() => onChangePage(currentPage + 1)}
              aria-label="Go to next page"
            >
              &rsaquo;
            </button>
          )}
          <button
            className={styles.pageButton}
            onClick={() => onChangePage(maxPage)}
            aria-label="Go to last page"
          >
            &raquo;
          </button>
        </div>
      );
}