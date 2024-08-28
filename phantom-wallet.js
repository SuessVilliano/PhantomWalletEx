window.addEventListener('load', async function () {
    const walletStatus = document.getElementById('wallet-status');
    const transactionArea = document.getElementById('transaction-area');

    async function connectWallet() {
        try {
            if (window.solana && window.solana.isPhantom) {
                // Attempt automatic connection
                const resp = await window.solana.connect({ onlyIfTrusted: true });
                updateUIConnected(resp.publicKey.toString());
            } else {
                walletStatus.innerHTML = `
                    <p class="error-message">Phantom wallet not found! Please install it.</p>
                    <a href="https://phantom.app" target="_blank" class="connect-button">Install Phantom Wallet</a>
                `;
            }
        } catch (err) {
            walletStatus.innerHTML = `<p class="error-message">Connection failed: ${err.message}</p>`;
        }
    }

    async function handleTransaction() {
        try {
            const transaction = new solanaWeb3.Transaction();
            // Add instructions to the transaction
            // e.g., transaction.add(someInstruction);

            const { signature } = await window.solana.signAndSendTransaction(transaction);
            transactionArea.innerHTML = `<p>Transaction sent with signature: ${signature}</p>`;
        } catch (err) {
            transactionArea.innerHTML = `<p class="error-message">Transaction failed: ${err.message}</p>`;
        }
    }

    function updateUIConnected(walletAddress) {
        walletStatus.innerHTML = `<p class="connected-info">Connected Wallet: ${walletAddress}</p>`;
        transactionArea.innerHTML = `<button class="connect-button" id="send-transaction">Send Test Transaction</button>`;
        document.getElementById('send-transaction').addEventListener('click', handleTransaction);
    }

    document.getElementById('connect-wallet').addEventListener('click', async function () {
        try {
            const resp = await window.solana.connect();
            updateUIConnected(resp.publicKey.toString());
        } catch (err) {
            walletStatus.innerHTML = `<p class="error-message">Connection failed: ${err.message}</p>`;
        }
    });

    // Attempt to automatically connect on page load
    connectWallet();
});
