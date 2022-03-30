const getRoleName = (code) => {
  switch (code) {
    case "admin":
      return "管理员";
    case "office":
      return "教务处";
    case "student":
      return "学生";
    case "teacher":
      return "指导老师";
    case "college":
      return "学院";
    case "xuegongchu":
      return "学工处";
    case "xiaofenguan":
      return "校分管领导";
  }
};
export default getRoleName