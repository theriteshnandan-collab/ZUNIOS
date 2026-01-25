"use client";

import { motion } from "framer-motion";
import { Github, Twitter, Mail, ArrowRight, MessageCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ConnectSection() {
    return (
        <section className="py-32 px-6 relative">
            <div className="container mx-auto max-w-4xl text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="space-y-6 mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-white">
                        Join the Neural Network
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Zunios is more than software. It's a collective of architects, dreamers, and builders.
                        Connect with us to shape the future of the OS.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-6">
                    {[
                        {
                            icon: Twitter,
                            title: "Follow Updates",
                            desc: "Real-time logs from the build process.",
                            link: "https://x.com/NandanRite30165",
                            label: "Follow @Zunios"
                        },
                        {
                            icon: Github,
                            title: "Review Code",
                            desc: "Open source core. Trust through transparency.",
                            link: "#",
                            label: "View Repository"
                        },
                        {
                            icon: MessageCircle,
                            title: "Join Community",
                            desc: "Discuss features and share workflows.",
                            link: "#",
                            label: "Enter Discord"
                        }
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="group p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all hover:-translate-y-1"
                        >
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                                <item.icon className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                            <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
                                {item.desc}
                            </p>
                            <Link href={item.link}>
                                <Button variant="outline" className="w-full bg-transparent border-white/20 hover:bg-white/5 group-hover:border-primary/50">
                                    {item.label} <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-24 p-12 rounded-3xl bg-gradient-to-b from-white/5 to-transparent border border-white/10 relative overflow-hidden">
                    <div className="absolute inset-0 bg-primary/5 blur-3xl" />
                    <div className="relative z-10">
                        <h3 className="text-2xl font-bold text-white mb-4">Have a feature request?</h3>
                        <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                            The Zunios architecture evolves based on user signals. Send us your transmission.
                        </p>
                        <a href="mailto:theriteshnandan@gmail.com">
                            <Button size="lg" className="bg-white text-black hover:bg-white/90 font-medium px-8 text-lg h-12">
                                Send Transmission <Mail className="w-4 h-4 ml-2" />
                            </Button>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
