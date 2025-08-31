import React from 'react';
import Nav from '../Nav';
import Footer from '../Footer';

const Terms = () => {
    return (
        <div className="overflow-hidden relative max-w-[1500px] mx-auto min-h-screen bg-black text-white">
            <Nav />

            <div className="max-w-[1300px] py-10 mx-auto px-5">
                <h1 className="text-3xl font-bold text-center mb-6">Pelito Terms and Conditions (Updated)</h1>
                <p className="mb-4">
                    By using Pelito’s services, platform, website, and related tools, including the Pelito Wallet, booking system, and Platinum Pelito Token,
                    you agree to the following terms and conditions. These terms are designed to ensure clarity, fairness, and protection for both users and the company.
                </p>

                <div className="space-y-6">
                    <section>
                        <h2 className="text-2xl font-semibold mb-2">1. Use of the Platform</h2>
                        <p>
                            Pelito provides services for grooming professionals and clients, including booking, payments, communication, and analytics.
                            By using the platform, users agree to use these services responsibly and in accordance with all applicable laws and regulations.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-2">2. Pelito Wallet & Financial Tools</h2>
                        <p>
                            The Pelito Wallet is a digital solution designed to support barbers and stylists in saving for retirement, managing income, and
                            receiving rewards via the Platinum Pelito Token (PLP). Pelito is not a licensed financial advisor or bank. Users accept full responsibility
                            for managing and securing their wallets. Pelito is not liable for lost tokens, forgotten credentials, or financial decisions made using the wallet.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-2">3. Liability Waiver</h2>
                        <p>
                            By using Pelito, you agree to waive your right to file any legal claim, lawsuit, or class action against the company, its founders,
                            team members, or partners. All services are provided 'as-is' without guarantees of outcomes, earnings, or platform uptime. Pelito
                            is not responsible for loss of income, missed appointments, or technical issues arising from third-party providers or user error.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-2">4. Data and Privacy</h2>
                        <p>
                            We respect your privacy. Pelito collects data to improve services and provide insights, but we do not sell personal information
                            to third parties. By using the platform, you consent to data collection for analytics, performance reports, and account customization.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-2">5. User Conduct</h2>
                        <p>
                            Users must not abuse or misuse the platform. This includes but is not limited to fraudulent bookings, harassment, exploitation of other users,
                            or attempts to hack, reverse engineer, or damage any part of the Pelito system. Violations will lead to suspension or permanent account removal.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-2">6. Modifications to Terms</h2>
                        <p>
                            Pelito reserves the right to modify these Terms and Conditions at any time. Continued use of the platform after changes are made constitutes
                            acceptance of the new terms.
                        </p>
                    </section>

                    <section>
                        <p className="mt-4">
                            If you do not agree with any part of these Terms and Conditions, you must stop using Pelito immediately.
                        </p>
                    </section>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default Terms;
