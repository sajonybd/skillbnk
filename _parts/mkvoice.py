import json, sys
from pathlib import Path
tpl_py = Path("generate-voice-websitebuilder.py").read_text()
tpl_sh = Path("generate-voice-websitebuilder.sh").read_text()
def make(folder, comp, title, scripts):
    t = tpl_py.replace("generate-voice-websitebuilder.py", f"generate-voice-{folder}.py").replace("generate-voice-websitebuilder.sh", f"generate-voice-{folder}.sh")
    t = t.replace('Voices WebsiteBuilderVideo ("Website Builder")', f'Voices {comp} ("{title}")').replace("src/WebsiteBuilderVideo.tsx", f"src/{comp}.tsx").replace('"public/websitebuilder"', f'"public/{folder}"')
    t = t.replace("Refresh Remotion Studio → WebsiteBuilderVideo.", f"Refresh Remotion Studio → {comp}.")
    a = t.index("ORDER = ["); b = t.index("\n}\n", t.index("SCRIPTS = {")) + 3
    body = "ORDER = " + json.dumps(list(scripts)) + "\n\n# Spoken text: brand written \"skillbank\" so TTS pronounces it right.\n# Claims verified against the skillBNK code. All names are fictional (Brightpath Academy).\nSCRIPTS = {\n" + "".join(f"    {json.dumps(k)}: {json.dumps(v)},\n" for k, v in scripts.items()) + "}\n"
    t = t[:a] + body + t[b:]
    Path(f"generate-voice-{folder}.py").write_text(t)
    Path(f"generate-voice-{folder}.sh").write_text(tpl_sh.replace("Website Builder", title).replace("websitebuilder", folder))
    words = {k: len(v.split()) for k, v in scripts.items()}
    print(folder, words, "≈ sec", {k: round(w / 2.55, 1) for k, w in words.items()})
EF = {
 "e0": "Every half-finished enrollment is a student you could lose. Most LMS platforms give you one fixed sign-up form. In skillbank, you build your own: your steps, your fields, every answer saved.",
 "e1": "In the company portal, open Enrollment form Builder. A new institute starts with an empty builder, so just click Initiate Now. You instantly get Step 1, with a first row, ready for fields.",
 "e2": "Up top are four buttons: Add New Step, Save, Preview, and Delete. On the right, the Form Elements panel holds fourteen building blocks, from short text to signatures and column layouts.",
 "e3": "Click the edit icon on Step 1, rename it Student Details, and save. Then click Add New Step, name it Guardian Info, and save. Do it once more for Documents. Three steps, ready.",
 "e4": "Fields sit in rows. Click Edit, rename row 1 to Personal Details, and update. Then click Add New Row Here, and add a second row: Contact Details.",
 "e5": "Now drag elements in from the right. Short Text for the student's name. Date for date of birth. Dropdown for the program. And Attachment for a photo ID. Drop each one straight into the row.",
 "e6": "Click any field to set it up. Type the label, add a short description, then fill in the dropdown options. Add New Option adds more. Turn on Required, and save. Rename the other fields the same way.",
 "e7": "Need two fields side by side? Drag in 2 Columns, then drop a Number and a Short Text into each side. To reuse a whole row, click Duplicates. Delete removes it.",
 "e8": "Click Preview to test the form the way a student will. Step by step, with Next and Previous, and Done on the last step. Happy with it? Close the preview, and click Save.",
 "e9": "Once saved, students see the same steps on your enroll page, next to the Order Summary. Every answer is saved with their enrollment. Open the student in Pending Members, and Student Information shows each answer by step, ready to export to CSV or print.",
 "e10": "Your steps, your questions, your enrollment form. Build it once, in skillbank.",
}
if __name__ == "__main__" and "ef" in sys.argv:
    make("enrollmentbuilder", "EnrollmentFormBuilderVideo", "Enrollment Form Builder", EF)
FB = {
 "f0": "Your student data is scattered across five outside tools. Most LMS platforms stop at enrollment, so every other form means another paid tool. In skillbank, every form lives inside your own platform.",
 "f1": "In the company portal, open Form Builder. All Forms lists every form, with its submissions and status at a glance. To build a new one, click Create New.",
 "f2": "The builder has three parts: form elements on the left, your form page in the middle, and properties on the right. Up top: Preview, Test, Export, Import, and Save.",
 "f3": "Click 2 Column Row. Drag Text Input into the left column, and Email into the right. Then add a 1 column row, and drop in a Select Dropdown. Rows and columns keep the layout clean.",
 "f4": "Click an element to select it. On the right, give it a label, Full name, and a placeholder. Then switch on Required, and the canvas updates as you go.",
 "f5": "Long form? Split it into pages. Click Add Tab, name it Your visit, and create it. Then search the elements for rating, and drag it onto the new page.",
 "f6": "Click Test to try the form before you publish. Submit it empty, and required fields are flagged. Fill it in, rate your visit, and Reset clears it all.",
 "f7": "Click Save. Name it Campus Visit Feedback, and set it to Active. Form Options can require sign-in, limit one response per user, allow editing, or send a confirmation email. Then click Save Form.",
 "f8": "Back in All Forms, your new form is active. Copy its link and share it anywhere. People fill in each page and submit. Every submission lands in your responses.",
 "f9": "One builder for every form. Build it, test it, share it, in skillbank.",
}
if __name__ == "__main__" and "fb" in sys.argv:
    make("formbuilder", "FormBuilderVideo", "Form Builder", FB)
FR = {
 "r0": "A parent asks about their answer, and you can't find it. Most tools never keep your answers in one place. In skillbank, every response lands in one table, with a one-click export.",
 "r1": "Someone opens your shared link, fills in the form, and clicks Submit Form. That submission is saved right away as a response.",
 "r2": "In the company portal, open Form Builder. The Submissions column counts every response for each form. In Actions, click View Responses.",
 "r3": "The responses page shows the form name and total responses. Each row has who submitted it, the date, whether they were signed in, and an action to view the full response.",
 "r4": "Click the eye icon to open Full Response Details. At the top: who submitted it, their email, and the date. Below, every answer, grouped by each page of your form.",
 "r5": "Signed In shows Yes when a logged-in learner sends it, and you see their name. Public visitors show No, with their email, or Anonymous when no email is collected.",
 "r6": "Need it in a spreadsheet? Click Export. You get an Excel file, with one column for every field. When you're done, Back to Forms takes you to the list.",
 "r7": "Every answer, in one place. Collect it, read it, export it, in skillbank.",
}
if __name__ == "__main__" and "fr" in sys.argv:
    make("formresponses", "FormResponsesVideo", "Form Responses", FR)
ML = {
 "m0": "Four locations. Four spreadsheets. And zero idea which one is losing students. With most LMS platforms, every location is its own island. In skillbank, one head office sees every location, live.",
 "m1": "In the company portal, open Branch Management. All Branches lists every location, with its name, short name, web address, who created it, and its status.",
 "m2": "To add a location, click Add New Branch. Step one: the name, web address, phone, fax and tax numbers. Then the full address: street, city, state, postal code, and country. Click Next.",
 "m3": "Step two: the primary contact person. Name, email and phone. Step three: a secondary contact, so someone is always reachable.",
 "m4": "Step four: describe the location, and add its social media links. Step five: upload the logo and the business documents. Then click Create Branch.",
 "m5": "The new location appears in the list as Pending, until it's approved. Approved locations are live. To see how any location is doing, click the eye icon.",
 "m6": "Each location gets its own summary: approved students, transactions, and the total amount. A chart shows the last twelve months, and below are the location's details and contacts.",
 "m7": "Every location, one head office. That's skillbank.",
}
TA = {
 "p0": "Someone just deleted your best program. The log says: admin. Problem is, everyone logs in as admin. Most LMS platforms give you one admin login. In skillbank, everyone gets a role, with only the access they need.",
 "p1": "Start with your programs. In Courses and Programs, All Bootcamps shows every program, its pricing, and the locations where it's offered. Not enrollable yet means no location is chosen.",
 "p2": "Click Select branches. On the Branches tab, tick the locations that should offer this program, and save. Now students at those locations can enroll.",
 "p3": "Next, your instructors. Click Add New Instructor, enter their name, email, a short bio, and a photo. Click Add, and they're ready to assign to programs.",
 "p4": "Now decide who can do what. In the Role List, click Add Role, name it Program Coordinator, and switch on only the permissions this role needs. Then click Add.",
 "p5": "Finally, add your staff. Click Add Staff, enter their email, and pick one or more roles. They get an invitation by email, with exactly the access you chose.",
 "p6": "The right people, with the right access. That's skillbank.",
}
IG = {
 "i0": "Friday night. Your payment key just expired, and enrollments are failing all weekend. Most LMS platforms lock you into their providers. In skillbank, you connect your own accounts, and test them all in one click.",
 "i1": "In the company portal, open Integrations. Every connection has its own tab: ChatGPT, Zoom, SendGrid, Twilio, Vimeo, and payment methods.",
 "i2": "For AI, paste your ChatGPT API key, and choose which locations can use it. Pick a model, like GPT-4o mini, switch it on, and save. Then test the connection.",
 "i3": "For live classes, add a Zoom account. Enter the title, account ID, client ID and client secret from the Zoom Marketplace, choose the locations, and save.",
 "i4": "SendGrid sends your emails from verified sender addresses. Twilio sends text messages from your own numbers. Add each one, choose the locations, and save.",
 "i5": "For payments, choose PayPal, Square, Stripe, or your own custom method. For Stripe, add a title and your secret key, pick which locations take card payments, and save.",
 "i6": "Click Check connections. A red dot flags anything that needs attention. Open it, update the setting, save, and test the connection again.",
 "i6b": "And every connection is set per location. Downtown takes cards with Stripe, Eastside uses PayPal and Twilio, and Northgate gets its own Zoom and Square. Each location gets exactly what it needs.",
 "i7": "Your accounts, connected in one place. That's skillbank.",
}
if __name__ == "__main__" and "ops" in sys.argv:
    make("locations", "ManageLocationsVideo", "Manage Multiple Locations", ML)
    make("teamaccess", "TeamAccessVideo", "Programs, Instructors & Staff", TA)
    make("integrations", "IntegrationsVideo", "Integrations", IG)

EM2 = {
 "s0": "Forty-eight email addresses, pasted by hand. Six bounce, and nobody knows who got it. Most LMS platforms send you somewhere else to email learners. In skillbank, pick a program, and every learner gets it, by name.",
 "s1": "Your location's email lives under Marketing Tools, Email Marketing. Every campaign shows its subject, how many users, how many were sent, how many failed, and whether it's scheduled. Click Add.",
 "s2": "Step one is the audience. Choose the user type, like Approved, then the program and the session. Your list fills in instantly. Untick anyone who shouldn't get it, then click Next.",
 "s3": "Step two, the email. Use a SendGrid template, or write a custom email. Pick the sender, add a subject, and write the body once. Use name in curly braces, turn on Include user name, and every learner sees their own name. Add a note, and send.",
 "s4": "It's sent. Twenty-four delivered, zero failed. Open Delivery Reports to see exactly who received it, and when, and export the list to CSV.",
 "s5": "Need it every week? Open Cron Jobs, set the schedule, like every Monday at nine, and save. The campaign now runs on its own.",
 "s6": "Every learner, by name, on time. That's skillbank."
}
SM2 = {
 "q0": "Class moved to 6 PM. You emailed everyone. By six, three people had opened it. Most LMS platforms can only send email, and urgent news waits in the inbox. In skillbank, you text the whole class, by name, in seconds.",
 "q1": "Open Marketing Tools, SMS Marketing. Every text you've sent is here, with how many were sent, failed, or scheduled. Click Add.",
 "q2": "Pick the sender, your own Twilio number from Integrations. Turn on Include user name, then write the message, using name in curly braces. Keep it under three hundred characters, and add a note.",
 "q3": "Now filter users. Choose Program Approved, then the program and the session. Or upload a CSV. Untick anyone who shouldn't get it, and click Send SMS.",
 "q4": "Twenty-three texts sent, none failed. For reminders that repeat, open Cron Jobs and schedule it, like every Wednesday at four.",
 "q5": "Urgent news, read in seconds. That's skillbank."
}
PR2 = {
 "o0": "Just give them twenty percent off. Then refund it by hand, and track it in a spreadsheet. Most LMS platforms have no real promo codes: no limits, no expiry, no report. In skillbank, one code does it all, right at checkout.",
 "o1": "In the company portal, open Promo Codes. Every code shows its uses, how many are left, and the total discount given. Click Create Promo.",
 "o2": "Give it a title, and the code students will type, like FALL20. Add a short description. Choose percentage or a fixed amount, set the value, and cap the maximum discount.",
 "o3": "Set the expiration date. Limit it to fifty uses in total, and one per student. Then choose Selected, tick Programs, and pick exactly which programs it works on. Save Promo.",
 "o4": "Your code is live. Click it to copy, and share it anywhere.",
 "o5": "At checkout, students enter the code in the order summary and click Apply. The discount and the new total appear instantly. Or share the enroll link with the promo already in it, and it's applied automatically.",
 "o6": "Open Report to see every use: the total discount, uses left, the top programs, and exactly who used it.",
 "o7": "Discounts that run themselves. That's skillbank."
}
if __name__ == "__main__" and "mk" in sys.argv:
    make("emailcampaigns", "EmailCampaignsVideo", "Email Campaigns", EM2)
    make("smscampaigns", "SmsCampaignsVideo", "SMS Campaigns", SM2)
    make("promocodes", "PromoCodesVideo", "Promo Codes", PR2)
